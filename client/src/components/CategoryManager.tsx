import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Table,
  Input,
  Select,
  Modal,
  Form,
  Radio,
  message,
} from "antd";
import {
  BellOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./CategoryManager.css";

interface Category {
  id: string;
  name: string;
  status: "active" | "inactive";
}

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const API_URL = "http://localhost:8080/categories";

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      message.error("Không thể tải danh mục!");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const isDuplicateId = categories.some(
        (cat) => cat.id.toLowerCase() === values.categoryId.toLowerCase()
      );
      const isDuplicateName = categories.some(
        (cat) => cat.name.toLowerCase() === values.categoryName.toLowerCase()
      );

      if (isDuplicateId || isDuplicateName) {
        if (isDuplicateId) {
          form.setFields([
            { name: "categoryId", errors: ["Mã danh mục đã tồn tại!"] },
          ]);
        }
        if (isDuplicateName) {
          form.setFields([
            { name: "categoryName", errors: ["Tên danh mục đã tồn tại!"] },
          ]);
        }
        return;
      }

      const newCategory = {
        id: values.categoryId,
        name: values.categoryName,
        status: values.status,
      };

      await axios.post(API_URL, newCategory);
      message.success("Thêm danh mục thành công!");
      setIsModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      console.error(error);
      message.error("Không thể thêm danh mục!");
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await updateForm.validateFields();
      const isDuplicateName = categories.some(
        (cat) =>
          cat.name.toLowerCase() === values.categoryName.toLowerCase() &&
          cat.id !== selectedCategoryId
      );
      if (isDuplicateName) {
        updateForm.setFields([
          { name: "categoryName", errors: ["Tên danh mục đã tồn tại!"] },
        ]);
        return;
      }

      await axios.put(`${API_URL}/${selectedCategoryId}`, {
        id: values.categoryId,
        name: values.categoryName,
        status: values.status,
      });

      message.success("Cập nhật danh mục thành công!");
      setIsUpdateModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      message.error("Không thể cập nhật danh mục!");
    }
  };

  const handleDelete = async () => {
    try {
      if (categories.length <= 1) {
        message.warning(
          "Không thể xóa! Phải có ít nhất 1 danh mục trong hệ thống."
        );
        setIsConfirmDeleteVisible(false);
        return;
      }
      await axios.delete(`${API_URL}/${selectedCategoryId}`);
      message.success("Xóa danh mục thành công!");
      setIsConfirmDeleteVisible(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      message.error("Không thể xóa danh mục!");
    }
  };

  // Modal
  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };
  const showUpdateModal = (record: any) => {
    setSelectedCategoryId(record.id);
    updateForm.setFieldsValue({
      categoryId: record.id,
      categoryName: record.name,
      status: record.status,
    });
    setIsUpdateModalVisible(true);
  };
  const showDeleteConfirm = (id: string) => {
    setSelectedCategoryId(id);
    setIsConfirmDeleteVisible(true);
  };
  const handleCancel = () => setIsModalVisible(false);
  const handleCancelUpdate = () => setIsUpdateModalVisible(false);
  const handleCancelDelete = () => setIsConfirmDeleteVisible(false);

  // Tìm kiếm & lọc
  const handleSearch = (value: string) => {
    const filtered = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(value.toLowerCase()) ||
        cat.id.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };
  const handleFilter = (value: string) => {
    if (value === "all") setFilteredData(categories);
    else setFilteredData(categories.filter((cat) => cat.status === value));
  };

  // Cột bảng với sắp xếp
  const columns = [
    {
      title: "Mã danh mục",
      dataIndex: "id",
      key: "id",
      sorter: (a: Category, b: Category) => a.id.localeCompare(b.id),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <span
          className={`status-badge ${
            text === "active" ? "status-active" : "status-inactive"
          }`}
        >
          {text === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
        </span>
      ),
    },

    {
      title: "Chức năng",
      key: "action",
      render: (_: any, record: any) => (
        <>
          <EditOutlined
            style={{ color: "orange", marginRight: 8, cursor: "pointer" }}
            onClick={() => showUpdateModal(record)}
          />
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => showDeleteConfirm(record.id)}
          />
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        width={250}
        style={{ background: "#f8f9fa", borderRight: "1px solid #e0e0e0" }}
      >
        <div className="logo">
          <img src="/assets/icons/Fire.png" alt="" width={40} />
          <h5 style={{ marginLeft: 8, fontSize: "18px" }}>🔥 Ecommerce</h5>
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={["2"]}>
          <Menu.Item key="1">Thống kê</Menu.Item>
          <Menu.Item key="2">Danh mục</Menu.Item>
          <Menu.Item key="3">Sản phẩm</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <div />
          <div style={{ display: "flex", alignItems: "center" }}>
            <BellOutlined style={{ fontSize: 20, marginRight: 16 }} />
            <img
              src="/assets/images/user-avatar.png"
              alt=""
              width={40}
              className="rounded-circle"
            />
          </div>
        </Header>

        {/* Content */}
        <Content style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2>Danh mục</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
              style={{ maxWidth: "160px" }}
            >
              Thêm mới danh mục
            </Button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Select
              defaultValue="all"
              style={{ width: 200 }}
              onChange={handleFilter}
            >
              <Option value="all">Tất cả</Option>
              <Option value="active">Đang hoạt động</Option>
              <Option value="inactive">Ngừng hoạt động</Option>
            </Select>
            <Input.Search
              placeholder="Tìm kiếm danh mục"
              onSearch={handleSearch}
              style={{ width: 300 }}
              enterButton
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              pageSize: 8, // Hiển thị 8 mục mỗi trang
              position: ["bottomCenter"],
              hideOnSinglePage: false,
              showLessItems: true,
            }}
          />
        </Content>
      </Layout>

      {/* Modal Thêm */}
      <Modal
        title="Thêm mới danh mục"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        closable={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryId"
            label="Mã danh mục"
            rules={[{ required: true, message: "Vui lòng nhập mã danh mục!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryName"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Radio.Group>
              <Radio value="active">Đang hoạt động</Radio>
              <Radio value="inactive">Ngừng hoạt động</Radio>
            </Radio.Group>
          </Form.Item>

          <div className="modal-footer-right">
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" onClick={handleSave}>
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal Cập nhật */}
      <Modal
        title="Cập nhật danh mục"
        open={isUpdateModalVisible}
        onCancel={handleCancelUpdate}
        footer={null}
        centered
        closable={false}
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item name="categoryId" label="Mã danh mục">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="categoryName"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Radio.Group>
              <Radio value="active">Đang hoạt động</Radio>
              <Radio value="inactive">Ngừng hoạt động</Radio>
            </Radio.Group>
          </Form.Item>

          <div className="modal-footer-right">
            <Button  onClick={handleCancelUpdate}>
              Hủy
            </Button>
            <Button type="primary" onClick={handleUpdate}>
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal Xóa */}
      <Modal
        title="Xác nhận xóa"
        open={isConfirmDeleteVisible}
        onCancel={handleCancelDelete}
        footer={null}
        centered
        closable={false}
      >
        <p>Bạn có chắc muốn xóa danh mục {selectedCategoryId} không?</p>
        <div className="modal-footer-right">
          <Button onClick={handleCancelDelete}>
            Hủy
          </Button>
          <Button danger type="primary" onClick={handleDelete}>
            Xóa
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default CategoryManager;
