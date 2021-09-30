import React, { useState, useEffect } from 'react';
import PubNub from 'pubnub';
import { PubNubProvider, usePubNub } from 'pubnub-react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const pubnub = new PubNub({
  publishKey: 'pub-c-c71b4127-a915-4da6-b760-beb5e3b3474b',
  subscribeKey: 'sub-c-bcc7f940-1fc5-11ec-8d5d-a65b09ab59bc',
  uuid: 'myUniqueUUID'
});

const currentChannel = "awesome-channel";
const theme = "light";

function App() {
  return (
    <PubNubProvider client={pubnub}>
    <Chat {...{ currentChannel, theme}} />
    </PubNubProvider>
  );
}

function Chat() {
  const [emojiPickerState, SetEmojiPicker] = useState(false);
  const pubnub = usePubNub();
  const [channels] = useState(['awesome-channel']);
  const [messages, addMessage] = useState([]);
  const [message, SetMessage] = useState('');

  const handleMessage = event => {
    const message = event.message;
    if (typeof message === 'string' || message.hasOwnProperty('text')) {
      const text = message.text || message;
      addMessage(messages => [...messages, text]);
    }
  };

  const sendMessage = message => {
    pubnub.publish({
      channel: 'awesome-channel',
      message
    })
    .then(() => SetMessage(''));
  };

let emojiPicker;
if (emojiPickerState) {
  emojiPicker = (
    <Picker
      title="Pick your emoji…"
      emoji="point_up"
      style={{position: 'absolute', top: '500px', bottom: '220px', left: '0px', right:'360px', margin:'auto'}}
      onSelect={emoji => SetMessage(message + emoji.native)}
    />
  );
}

function triggerPicker(event) {
  event.preventDefault();
  SetEmojiPicker(!emojiPickerState);
}


useEffect(() => {
  pubnub.addListener({ message: handleMessage });
  pubnub.subscribe({ channels });
}, [pubnub, channels]);

// CSS
const pageStyles = {
  alignItems: 'center',
  background: 'white',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100vh',
};

const chatStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '80vh',
  width: '75%',
};

const headerStyles = {
  position: 'relative',
  width: '650px',
  background: 'rgba(99, 180, 184, 0.5)',
  color: '#4B3869',
  fontSize: '1.4rem',
  padding: '10px 15px',
  borderRadius: '15px',
  textAlign: 'center',
  top: '-160px',
  margin: 'auto',
  zIndex: '1',
  fontWeight: 'bold',
};

const listStyles = {
  alignItems: 'flex-start',
  backgroundColor: 'rgba(169, 228, 215, 0.3)',
  borderStyle: 'solid',
  borderWidth: 'thin',
  borderColor: 'rgba(75, 56, 105, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  width: '700px',
  height: '700px',
  overflow: 'auto',
  padding: '70px 25px 75px 25px',
  borderRadius: '15px',
  margin: 'auto',
  position: 'absolute',
  top:'0',
  bottom: '0',
  left: '0',
  right: '0',
};

const messageStyles = {
  backgroundColor: '#4B3869',
  color: 'white',
  borderRadius: '30px',
  fontSize: '1.1rem',
  margin: '5px',
  padding: '8px 15px',
  position: 'relative',
  boxShadow: " 3px 6px 10px rgba(20,20,20,0.4)",
  textAlign: 'center',
};

const footerStyles = {
  display: 'flex',
  position: 'relative',
  margin: 'auto',
  width: '700px',
  top: '150px',
};

const inputStyles = {
  flexGrow: 1,
  fontSize: '1.1rem',
  padding: '10px 15px',
  borderRadius: '15px',
  borderColor: '#4B3869',
};

const buttonStyles = {
  fontSize: '1.1rem',
  padding: '10px 15px',
  borderRadius: '15px',
  color: '#4B3869',
  backgroundColor: '#63B4B8',
  borderColor: '#4B3869',
  fontWeight: 'bold',
  margin: '1px',
};


// HTML
return (

  <div style={pageStyles}>
    <div style={chatStyles}>
      <div style={headerStyles}>Build Circle Chat</div>
        <div style={listStyles}>
          {messages.map((message, index) => {
            return (
              <div key={`message-${index}`} style={messageStyles}>
                {message}
              </div>
            );
          })}
        </div>
          {emojiPicker}
        <div style={footerStyles}>
          <button title="Add an emoji" style={buttonStyles}
            onClick={triggerPicker
            }> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="currentColor" fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM5 8a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM5.32 9.636a.75.75 0 011.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 111.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 01-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 01-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 01.183-1.044h.001z"></path></svg>
          </button>
          <input
            type="text"
            style={inputStyles}
            placeholder="Type your message"
            value={message}
            onKeyPress={e => {
              if (e.key !== 'Enter') return;
              sendMessage(message);
            }}
            onChange={e => SetMessage(e.target.value)}
          />
          <button
            style={buttonStyles}
            onClick={e => {
              e.preventDefault();
              sendMessage(message);
            }}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
