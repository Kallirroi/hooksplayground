import React, {useState, useEffect} from 'react';
import './App.css';
import { Typography, Input, Row, Col, Card, Button, Switch} from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';

function App() {

  // initialize antd elements
  const { Title, Text } = Typography;
  const { TextArea } = Input;

  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [channelURL, setChannelURL] = useState('');

  function onToggle() {
    setChecked( prevState => !prevState)
  }

  const getData = () => {
    setLoading(true)
    fetch(`https://api.are.na/v2/channels/${channelURL}/contents`)
    .then(response => response.json())
    .then(data => {
      setData(data.contents); 
      setLoading(false);
    });
  }

  loading ? console.log('loading') : console.log(data)

  return (
    <div className="App">
      <Title>hooks + typescript playground</Title>
      <Title level={4}>using are.na API</Title>
      <Text type="secondary">This app has two modes: one that adds text blocks to an arena channel of your choice, and one that fetches content from it.</Text>

      {checked && 
        <div className='fetchMode'>
          <Row style={{ margin: '16px 0' }}>
            <Col span={12}>
              <Input 
              autoFocus 
              placeholder="Enter the channel URL" 
              onChange={event => {
                setChannelURL(event.target.value);
              }}
              /> 
            </Col>
          </Row>      
          <Button onClick={getData} loading={loading}> Get channel contents </Button>
        </div>
      }

      {!checked && 
        <div className='putMode'>
          <Row style={{ margin: '16px 0' }}>
            <Col span={12}>
              <Input autoFocus placeholder="Enter the channel URL" /> 
            </Col>
          </Row>      

          <Row style={{ margin: '16px 0' }}>
            <Col span={12}>
              <TextArea autoFocus placeholder="Enter your text" rows={4} />
            </Col>
          </Row>

          <Button> Add to channel </Button>
        </div>      
       }

      <Row style={{ marginTop: '2vh'}}>
        <Switch onToggle={onToggle} defaultChecked/>
        <Text type="secondary" style={{ marginLeft: '0.2vw' }}>Toggle to other mode</Text>
      </Row>

    </div>
  );
}

export default App;

