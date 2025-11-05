import { Row, Col, Drawer, Button, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  MenuOutlined,
  HomeOutlined,
  SearchOutlined,
  CarOutlined,
  UserOutlined,
  NotificationOutlined,
} from '@ant-design/icons';

const Root = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { key: '/', label: 'Главная', icon: <HomeOutlined /> },
    {
      key: '/search',
      label: 'Поиск',
      icon: <SearchOutlined />,
      color: 'green',
    },
    { key: '/trips', label: 'Минск-Иваново', icon: <CarOutlined /> },
    { key: '/tripsMI', label: 'Все Минск-Иваново', icon: <CarOutlined /> },
    { key: '/tripsGI', label: 'Гродно-Иваново', icon: <CarOutlined /> },
    { key: '/news', label: 'Новости', icon: <NotificationOutlined /> },
    { key: '/users', label: 'Пользователи', icon: <UserOutlined /> },
  ];

  const DesktopNavigation = () => (
    <Row
      justify="space-between"
      align="middle"
      style={{
        padding: '12px 24px',
        borderBottom: '1px solid #f0f0f0',
        background: '#fff',
      }}
    >
      <Col>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ border: 'none', fontSize: '16px' }}
          items={menuItems.map((item) => ({
            key: item.key,
            label: (
              <Link to={item.key} style={{ color: item.color || 'inherit' }}>
                {item.icon} {item.label}
              </Link>
            ),
          }))}
        />
      </Col>
    </Row>
  );

  const MobileNavigation = () => (
    <>
      <Row
        justify="space-between"
        align="middle"
        style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}
      >
        <Col>
          <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Транспорт
          </Link>
        </Col>
        <Col>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            style={{ fontSize: '18px' }}
          />
        </Col>
      </Row>

      <Drawer
        title="Меню"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          style={{ border: 'none' }}
          items={menuItems.map((item) => ({
            key: item.key,
            label: (
              <Link
                to={item.key}
                style={{ color: item.color || 'inherit', fontSize: '16px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon} {item.label}
              </Link>
            ),
          }))}
        />
      </Drawer>
    </>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Десктопная навигация */}
      <div className="desktop-nav">
        <DesktopNavigation />
      </div>

      {/* Мобильная навигация */}
      <div className="mobile-nav">
        <MobileNavigation />
      </div>

      {/* Основной контент */}
      <div style={{ padding: '16px' }}>
        <Outlet />
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: block;
          }
          .mobile-nav {
            display: none;
          }
        }
        
        @media (max-width: 767px) {
          .desktop-nav {
            display: none;
            }
          .mobile-nav {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default Root;
