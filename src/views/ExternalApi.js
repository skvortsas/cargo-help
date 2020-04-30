import React, { useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-spa";

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [createResult, setCreateResult] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [updateResult, setUpdateResult] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const { getTokenSilently } = useAuth0();
  let userId = '';
  let userName = '';

  const getUser = async () => {
    userId = document.getElementById('getUser').value;

    try {
      const token = await getTokenSilently();

      const response = await fetch("http://localhost:3001/api/getUser?userId=" + userId, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const responseData = await response.json();

      setApiMessage(responseData.msg);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setShowResult(true);
  }, [apiMessage.msg]);

  useEffect(() => {
    setCreateResult(true);
  }, [apiResponse]);

  useEffect(() => {
      setUpdateResult(true);
  }, [updateResult]);

  const createNewUser = async () => {
    userName = document.getElementById('createUser').value;

    const postBody = {
        "userName": userName
    }

      try {
          const token = await getTokenSilently();

          const response = await fetch("http://localhost:3001/api/createUser", {
              method: 'POST',
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(postBody)
          });

          const responseData = await response.json();

          setApiResponse((responseData.msg).toString());
      } catch (error) {
          console.error(error)
      }
  }

  const updateUser = async () => {
      userName = document.getElementById('createUser').value;
      userId = document.getElementById('getUser').value;

      const updateBody = {
          "userName": userName,
          "userId": userId
      }

      try {
          const token = await getTokenSilently();

          const response = await fetch('http://localhost:3001/api/updateUser', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateBody)
          });

          const responseData = await response.json();

          setUpdateMessage(responseData.msg);
      } catch(error) {
        console.error(error);
      }
  }

  return (
    <div className='App'>
        <div className='App-header'>
            <h1>External API</h1>
            <input id='getUser' placeholder='id of user' />
            <button onClick={ getUser }>get user</button>
            { showResult && apiMessage }
            <br />
            <input id='createUser' placeholder='name of user' />
            <button onClick = { createNewUser }>create user</button>
            { !createResult && 'Загрузка...' }
            { createResult && apiResponse && 'Пользователь успешено создан' }
            <br />
            <button onClick={ updateUser }>update user</button>
            { updateResult && updateMessage }
        </div>
    </div>
  );
};

export default ExternalApi;