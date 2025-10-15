import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Input } from "antd";
import axios from "axios";
import {
  HeartOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { MdPhoneAndroid } from "react-icons/md";
import { HiOutlineCamera, HiOutlineDesktopComputer } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import { LuGamepad } from "react-icons/lu";
import { FiHeadphones } from "react-icons/fi";
import { CiHeart } from "react-icons/ci";

import "./Dashboard.css";
import phoneMenu from "../imgs/phonemenu.png";
import logo from "../imgs/LogoBlack.png";
import logoWhite from "../imgs/Logo.png";
import footerBanner from "../imgs/Banner2.png";
import type { Discount, Product } from "../utils/type";
import { Dropdown, Menu } from "antd";

const { Meta } = Card;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const getAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/products");
      const resD = await axios.get("http://localhost:8080/discount");
      console.log("Products data:", res.data);
      console.log("Discounts data:", resD.data);
      setProducts(res.data);
      setDiscounts(resD.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const handleLogout = () => {
    // Xử lý đăng xuất ở đây, ví dụ:
    localStorage.removeItem("token");
    alert("Đã đăng xuất!");
    // hoặc điều hướng về trang đăng nhập
    window.location.href = "/login";
  };

  // Chỉ chạy 1 lần khi component mount
  useEffect(() => {
    getAllProducts();
  }, []);

  // Log khi products thay đổi
  useEffect(() => {
    console.log("Products đã cập nhật:", products);
  }, [products]);

  // Log khi discounts thay đổi
  useEffect(() => {
    console.log("Discounts đã cập nhật:", discounts);
  }, [discounts]);
  const categories = [
    { name: "Điện thoại", icon: <MdPhoneAndroid /> },
    { name: "Đồng hồ", icon: <LuGamepad /> },
    { name: "Cameras", icon: <HiOutlineCamera /> },
    { name: "Tai nghe", icon: <FiHeadphones /> },
    { name: "Máy tính", icon: <HiOutlineDesktopComputer /> },
    { name: "Gaming", icon: <LuGamepad /> },
  ];

  return (
    <div>
      <header>
        <div className="header-container">
          <img src={logo} alt="logo" />
          <Input
            style={{
              width: "100%",
              maxWidth: "458px",
              height: "56px",
              backgroundColor: "#F5F5F5",
            }}
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm"
          />
          <p>
            <NavLink to="/" className="nav-link">
              Trang chủ
            </NavLink>
          </p>
          <p>
            <NavLink to="/" className="nav-link">
              Giới thiệu
            </NavLink>
          </p>
          <p>
            <NavLink to="/" className="nav-link">
              Liên hệ
            </NavLink>
          </p>
          <div className="header-container-icon">
            <HeartOutlined />
            <ShoppingCartOutlined />
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="logout" onClick={() => handleLogout()}>
                    Đăng xuất
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
              trigger={["click"]}
            >
              <UserOutlined style={{ cursor: "pointer" }} />
            </Dropdown>
          </div>
        </div>
        <br />
        <div className="header-menu-item">
          <div className="menu-item">
            <MdPhoneAndroid /> Điện thoại
          </div>
          <div className="menu-item">
            <HiOutlineDesktopComputer /> Laptop
          </div>
          <div className="menu-item">
            <LuGamepad /> Đồng hồ thông minh
          </div>
          <div className="menu-item">
            <HiOutlineCamera /> Cameras
          </div>
          <div className="menu-item">
            <FiHeadphones /> Tai nghe
          </div>
          <div className="menu-item">
            <LuGamepad /> Gaming
          </div>
        </div>

        <div className="banner">
          <div className="banner-content">
            <h4>Đột phá công nghệ</h4>
            <h1>
              IPhone 14 <span>Pro</span>
            </h1>
            <p>
              Được tạo ra để thay đổi mọi thứ để tốt hơn. Cho tất cả mọi người.
            </p>
            <button className="btn">Mua ngay</button>
          </div>
          <div className="banner-image">
            <img src={phoneMenu} alt="banner" />
          </div>
        </div>
      </header>

      {/* body */}
      <div style={{ padding: "40px 60px", backgroundColor: "#f9f9f9" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <h2 style={{ fontWeight: 600 }}>Danh mục sản phẩm</h2>
          <div>
            <LeftOutlined />
            <RightOutlined />
          </div>
        </div>
        {/* Danh mục sản phẩm */}
        <Row gutter={[16, 16]} justify="center">
          {categories.map((cat) => (
            <Col xs={12} sm={8} md={6} lg={4} key={cat.name}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  borderRadius: "12px",
                  backgroundColor: "#f2f2f2",
                  transition: "all 0.3s",
                }}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "120px",
                }}
              >
                {cat.icon}
                <p style={{ marginTop: "10px", fontWeight: 500 }}>{cat.name}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <div style={{ padding: "40px" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "32px" }}>
          <p style={{ borderBottom: "1px solid #000000" }}>New arrival</p>
          <p>Bestseller</p>
          <p>Featured Products</p>
        </div>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={
                  <div style={{ position: "relative" }}>
                    <img
                      alt={product.product_name}
                      src={product.image}
                      style={{
                        height: 200,
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <CiHeart className="icon-like" />
                  </div>
                }
              >
                <Meta
                  title={product.product_name}
                  description={`${product.price.toLocaleString()} $`}
                />
                <Button
                  type="primary"
                  block
                  style={{
                    marginTop: "10px",
                    background: "black",
                    border: "none",
                  }}
                >
                  Mua ngay
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Giảm giá */}
        <h1>Sản phẩm giảm giá</h1>
        <Row gutter={[16, 16]}>
          {discounts.map((discount) => (
            <Col xs={24} sm={16} md={8} lg={6} key={discount.id}>
              <Card
                hoverable
                cover={
                  <div style={{ position: "relative" }}>
                    <img
                      alt={discount.name}
                      src={discount.image}
                      style={{
                        height: 200,
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <CiHeart className="icon-like" />
                  </div>
                }
              >
                <Meta title={discount.name} description={`${discount.price}`} />
                <Button
                  type="primary"
                  block
                  style={{
                    marginTop: "10px",
                    background: "black",
                    border: "none",
                  }}
                >
                  Mua ngay
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="body-low">
        <img src={footerBanner} alt="" />
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-about">
            <img src={logoWhite} alt="logo" />
            <p>
              Chúng tôi cung cấp các sản phẩm công nghệ, giúp khách hàng thỏa
              sức trải nghiệm các dịch vụ, tiện ích nhanh chóng và hiệu quả.
            </p>
            <div className="footer-socials">
              <FaTwitter />
              <FaFacebookF />
              <FaTiktok />
              <FaInstagram />
            </div>
          </div>

          <div className="footer-links">
            <h4>Dịch vụ</h4>
            <ul>
              <li>Chương trình khuyến mãi</li>
              <li>Gift cards</li>
              <li>Tín dụng và thanh toán</li>
              <li>Dịch vụ hợp đồng</li>
              <li>Ví tiền điện tử</li>
              <li>Thanh toán</li>
            </ul>
          </div>

          <div className="footer-support">
            <h4>Hỗ trợ</h4>
            <ul>
              <li>Tìm kiếm đơn đặt hàng</li>
              <li>Điều khoản giao hàng</li>
              <li>Trao đổi và trả hàng</li>
              <li>Chính sách bảo hành</li>
              <li>Câu hỏi thường gặp</li>
              <li>Chính sách và điều khoản</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
