import React, {useState, useEffect, useRef, useContext} from 'react';
import './App.css';
import { Typography, Input, Row, Col, Card, Button, Switch} from 'antd';

import { ThemeContext } from "./ThemeProvider";

function App() {

  // initialize antd elements
  const { Title, Text, Paragraph} = Typography;
  const {Meta} = Card;

  // initialize state variables
  const [state, setState] = useState({
    loading: false,
    channelURL: '',
    textArea: ''
  })
  const inputEl = useRef(null); // creating a ref for input elements
  const [persistedData, setPersistedData] = usePersistedState('fetchedData',[]);

  const themes = {
    light: {
      font: "#000",
      background: "#fff"
    },
    dark: {
      font: "#fff",
      background: "#171a1c"
    }
  };
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [fontColor, setFontColor] = useState('');

  function handleToggle() {  
    // toggles the mode, empties data array, resets channelURL, clears inputEl field
   
    // setMode(!mode)
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
      return JSON.parse(localStorage.getItem(key))  || defaultValue
    })

    // update the element at [key] position with state if needed
    useEffect(()=>{
      if (state !== undefined) localStorage.setItem(key, JSON.stringify(state))
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
      setPersistedData(data.contents);
    })
    .catch(error => console.log(error))
  }

  useEffect(()=> {
    document.body.style.color = themes[theme].font;
    document.body.style.backgroundColor = themes[theme].background;
    setFontColor(themes[theme].font)
  },[theme])

  return (
    <div className="App" >
      <Title style={{ color: `${fontColor}` }} level={1}>React Hooks playground</Title>
      <Title style={{ color: `${fontColor}` }} level={4}>using <a href='https://ant.design/' target='_blank' rel="noopener noreferrer">ant.design</a> and typescript</Title>
      <Row >
        <Col span={16}>
            <Paragraph style={{ color: `${fontColor}` }} type="secondary">Enter an <a href='https://www.are.na/' target='_blank' rel="noopener noreferrer">are.na</a> channel of your choice to fetch its images and display them below. You can copy and paste the following URL to get started. <Text copyable style={{ color: `${fontColor}` }} code>https://www.are.na/kalli-retzepi/mais-oui-images</Text></Paragraph>
          </Col>
      </Row>  
        
      <div className='fetchMode' >
        <Row >
          <Col span={10}>
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
        <Button style={{ margin: '2vh 0'}} onClick={getData} loading={state.loading}> Get channel contents </Button>
      
        <div className='cards'>
          {persistedData !== undefined && 
            persistedData.map( (item, i) => (
            <Card
              key={i}
              style={{ 
                width: '20%', 
                alignSelf: 'stretch', 
                margin: '1vh 1vw 1vh 0',
              }}
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

      {/*     TOGGLE        */}
      <Row style={{ margin: '45vh 0 5vh 0'}}>
        <Col span={6}>
          <Switch onChange={handleToggle}/>
          <Text type="secondary" style={{ color: `${fontColor}` , marginLeft: '0.2vw' }}>Toggle theme</Text>
        </Col>
        <Col span={6}></Col>
        <Col span={6}></Col>
        <Col span={6}>
          <Text type="secondary" style={{color: `${fontColor}` }}>
            <a href="https://github.com/Kallirroi/hooksplayground" target="_blank" rel="noopener noreferrer">link to github</a>
          </Text>
        </Col>
      </Row>     
    </div>
  );
}

export default App;

