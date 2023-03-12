import { Col, Row } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const Root = () => {
  return (
    <>
      <Row>
        <Col span={6}>
          <Link to="/" style={{ fontSize: 32 }}>
            Главная
          </Link>
        </Col>
        <Col span={6}>
          <Link to="/trips" style={{ fontSize: 32 }}>
            Поездки
          </Link>
        </Col>
        <Col span={6}>
          <Link to="/news" style={{ fontSize: 32 }}>
            Новости
          </Link>
        </Col>
        <Col span={6}>
          <Link to="/users" style={{ fontSize: 32 }}>
            Пользователи
          </Link>
        </Col>
      </Row>
      <hr />

      <Outlet />
    </>
  );
};

export default Root;
