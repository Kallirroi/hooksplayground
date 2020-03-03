import React, {useState, useEffect, useRef, useContext} from 'react';
import './App.css';
import { Typography, Input, Row, Col, Card, Button, Switch} from 'antd';

import { ThemeContext } from "./ThemeProvider";

function App() {

  // initialize antd elements
  const { Title, Text } = Typography;
  const { TextArea } = Input;
  const {Meta} = Card;

  // initialize state variables
  const [state, setState] = useState({
    loading: false,
    channelURL: '',
    textArea: ''
  })
  const [mode, setMode] = useState(true)  // where fetchMode = true
  const inputEl = useRef(null); // creating a ref for input elements
  const textEl = useRef(null);
  const [persistedData, setPersistedData] = usePersistedState([]);

  const themes = {
    light: {
      font: "#000",
      background: "#fff"
    },
    dark: {
      font: "#fff",
      background: "#000"
    }
  };
  const { theme, toggleTheme } = useContext(ThemeContext);

  function handleToggle() {  
    // toggles the mode, empties data array, resets channelURL, clears inputEl field
    setMode(!mode)
    setState((prevState) => ({
      ...prevState, 
      data: [],
      channelURL: ''
    }));
    inputEl.current.setValue('')
    toggleTheme(theme);
  }

  function usePersistedState(key, defaultValue) {
    // create the element in local storage if it doesn't exist
    const [state, setState] = useState(()=> {
      return localStorage.getItem(key) || defaultValue
    })

    // update the element at [key] position with state if needed
    useEffect(()=>{
      if (state !== undefined) localStorage.setItem(key, state)
    },[key, state])

    return [state, setState];
  }

  const getData = async () => {
    setState((prevState) => ({...prevState, loading: true})); //indicate loading as long as request is being processed

    fetch(`https://api.are.na/v2/channels/${state.channelURL}/contents`)
    .then(response => response.json())
    .then(data => {
      setState((prevState) => ({
        ...prevState, 
        loading: false,
        channelURL: ''
      })); 
      inputEl.current.setValue('')
      setPersistedData(data.contents)
    })
    .catch(error => console.log(error))
  }

  const postData = async () => {
    setState((prevState) => ({...prevState, loading: true})); 

    fetch(`https://api.are.na/v2/channels/${state.channelURL}/blocks`,{
      method: 'POST',
      headers: {
        'Authorization': 'Bearer d905ef20f9e5764f7a5dd418cf37c9fc68c37e6ab243343f53f9ccdcb7acbc78',
        'Content-Type': 'application/json'
      },
      //make sure to serialize your JSON body
      body: JSON.stringify({
        content: `${state.textArea}`
      })
    })
    .then( (response) => { 
      response.json()
    })
    .then( (data) => {
      console.log(data)
      setState((prevState) => ({
        ...prevState, 
        loading: false,
        channelURL: '',
        textArea: ''
      })); 
      inputEl.current.setValue('')
      textEl.current.setValue('')
    })
    .catch(error => console.log(error))
  }

  useEffect(()=> {
    console.log(persistedData)
  },[persistedData])

  useEffect(()=> {
    document.body.style.color = themes[theme].font;
    document.body.style.backgroundColor = themes[theme].background;
  },[theme])

  return (
    <div className="App" >
      <Title style={{ color: `${themes[theme].font}` }} level={2}>are.na + hooks + typescript playground</Title>
      <Text style={{ color: `${themes[theme].font}` }} type="secondary">This app has two modes: one that fetches content from an are.na channel of your choice and one that adds text blocks to it. For example: <Text code>https://www.are.na/kalli-retzepi/mais-oui-images</Text>
      </Text>

      {/*     FETCH MODE      */}
      {mode && 
        <div className='fetchMode' >
          <Row style={{ margin: '16px 0' }}>
            <Col span={12}>
              <Input 
              autoFocus 
              placeholder="Enter the channel URL" 
              ref={inputEl}
              onChange={event => {
                let inputString = event.target.value.split('/')
                setState((prevState) => ({...prevState, channelURL: inputString[inputString.length-1]}));
              }}
              /> 
            </Col>
          </Row>      
          <Button style={{ marginBottom: '2vh'}} onClick={getData} loading={state.loading}> Get channel contents </Button>
        
          <div className='cards'>
            {persistedData !== undefined && 
              persistedData.map( (item, i) => (
              <Card
                key={i}
                style={{ width: '20%', alignSelf: 'stretch', margin: '1vh 1vw 1vh 0'}}
                cover={
                  <img
                    alt="example"
                    src={item.image.thumb.url}
                  />
                }>
                <Meta
                  title= {item.title}
                  description={item.created_at}
                />
              </Card>
              ))
            }
          </div>
        </div>
      }

      {/*     POST MODE        */}
      {!mode && 
        <div className='putMode'>
          <Row style={{ margin: '16px 0' }}>
            <Col span={12}>
              <Input 
              autoFocus 
              ref={inputEl}
              placeholder="Enter the channel URL" 
              onChange={event => {
                let inputString = event.target.value.split('/')
                setState((prevState) => ({...prevState, channelURL: inputString[inputString.length-1]}));
              }}
              /> 
            </Col>
          </Row>      

          <Row style={{ margin: '16px 0' }}>
            <Col span={12}>
              <TextArea 
                ref={textEl}
                autoFocus 
                placeholder="Enter your text" 
                onChange={event => {
                  let inputString = event.target.value
                  setState((prevState) => ({...prevState, textArea: inputString}));
                }}
                rows={4} />
            </Col>
          </Row>

          <Button style={{ marginBottom: '2vh'}} onClick={postData} loading={state.loading}> Add to channel </Button>
        </div>      
       }

  
      {/*     TOGGLE        */}
      <Row style={{ margin: '2vh 0'}}>
        <Switch onChange={handleToggle}/>
        <Text type="secondary" style={{ marginLeft: '0.2vw' }}>Toggle to other mode</Text>
      </Row>
    </div>
  );
}

export default App;

