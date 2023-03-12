import { Card, Input, Button } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../app';
import axios from 'axios';
const { TextArea } = Input;

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const [user, setUser] = useContext(UserContext);
  const onLogin = async () => {
    const res = await axios.post(`${import.meta.env.VITE_ROUTE}`, {
      login,
      password,
    });
    if (res.data) {
      localStorage.setItem('isLogin', true);
      setUser(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const isLogin = localStorage.getItem('isLogin');
    if (isLogin) {
      setUser(true);
    }
  }, []);

  const changeLogin = (value) => {
    setLogin(value.target.value);
  };

  const changePassword = (value) => {
    setPassword(value.target.value);
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {user}
      <Card title="Авторизуйтесь" style={{ width: 600 }}>
        <TextArea
          placeholder="Логин"
          autoSize
          value={login}
          onChange={changeLogin}
        />
        <div style={{ margin: '24px 0' }} />
        <TextArea
          placeholder="Пароль"
          autoSize
          value={password}
          onChange={changePassword}
        />
        <div style={{ margin: '24px 0' }} />
        {error ? (
          <div style={{ color: 'red' }}>Неверный логин или пароль</div>
        ) : (
          ''
        )}

        <Button type="primary" onClick={onLogin}>
          Войти
        </Button>
      </Card>
    </div>
  );
};

export default Login;
