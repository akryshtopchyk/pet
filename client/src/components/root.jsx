import { Row } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const Root = () => {
  return (
    <>
      <Row>
        <Row style={{ margin: '12px' }}>
          <Link to="/" style={{ fontSize: 32 }}>
            Главная
          </Link>
        </Row>
        <Row style={{ margin: '12px' }}>
          <Link to="/trips" style={{ fontSize: 32 }}>
            Поездки Минск - Иваново
          </Link>
        </Row>
        <Row style={{ margin: '12px' }}>
          <Link to="/tripsGI" style={{ fontSize: 32 }}>
            Поездки Гродно - Иваново
          </Link>
        </Row>
        <Row style={{ margin: '12px' }}>
          <Link to="/news" style={{ fontSize: 32 }}>
            Новости
          </Link>
        </Row>
        <Row style={{ margin: '12px' }}>
          <Link to="/users" style={{ fontSize: 32 }}>
            Пользователи
          </Link>
        </Row>
      </Row>
      <hr />

      <Outlet />
    </>
  );
};

export default Root;
