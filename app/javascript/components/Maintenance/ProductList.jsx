import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment/moment";
import CTable from '../CTable'
// import moment from "moment";
import {
  Form,
  Input,
  InputNumber,
  Layout,
  Popconfirm,
  DatePicker,
  Table,
  Select,
  Button,
  Modal,
  notification,
} from "antd";

import {
  TrashIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

import NavbarSection from "../layouts/Header/Navbar";
import FooterSection from "../layouts/Footer/Index";

import message from "../../utils/content/jp.json";


let plan_color, star_color, plan_text;

const { Content } = Layout;

const ProductList = () => {
  const [form] = Form.useForm();

  const [searchText, setSearchText] = useState("");
  const [updateData, setUpdateData] = useState({});
  const [isposted, setIsPosted] = useState(false);

  const [updateStatus, setUpdateStatus] = useState("Create");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allData, setAllData] = useState([]);
  const [showData, setShowData] = useState([]);
  //fee
  const [feeData, setFeeData] = useState([]);
  const [feePackaging, setFeePackaging] = useState('');
  const [feeID, setFeeID] = useState('');

  const [handlingFeeRate, setHandlingFeeRate] = useState("");
  const [feeCategory, setFeeCategory] = useState("");
  const [storageFeeRate, setStorageFeeRate] = useState("");


  const getAllProduct = () => {
    axios.get("http://127.0.0.1:3000/api/product").then((res) => {
      let index = 1;
      let products = res.data.data.map((item) => {
        let feeData = item.data.attributes.warehouse_fee;
        return {
          key: index++,
          name: item.data.attributes.name,
          packaging: feeData.packaging,
          storage_fee_rate: feeData.storage_fee_rate,
          handling_fee_rate: feeData.handling_fee_rate,
          fee_category: feeData.fee_category
        };
      });
      setAllData(products);
      setShowData(products);

    });
  };

  const getAllFeeData = () => {
    axios.get('http://127.0.0.1:3000/api/warehouse_fee').then((res) => {
      let index = 1
      const priceData = res.data.data.map((item) => {
        return {
          ...item,
          key: index++,
        };
      });
      setFeeData(priceData);
      const feePackaging = priceData.map(item => item.packaging)
      setFeePackaging(feePackaging)
    });
  }

  const onSubmit = async () => {
    try {
      let product = await form.validateFields();
      if (updateData) {
        await axios.put("http://127.0.0.1:3000/api/product", {
          id: updateData.id, ...product
        }
        );
        notification.success({ message: 'Update Success', duration: 1 });
        setIsModalOpen(false);
        setIsPosted(!isposted);

      } else {
        const postProduct = { ...product, warehouse_fee_id: feeID }
        await axios.post("http://127.0.0.1:3000/api/product", { ...product, warehouse_fee_id: feeID });
        notification.success({ message: 'Create Success', duration: 1 })
        setIsModalOpen(false);
        setIsPosted(!isposted);

      }
    } catch (err) {
      notification.error({ message: "Complete All Input Fields.", duration: 1 })
    }

  }

  const handleSearchText = (e) => {
    setSearchText(e.target.value)
  }

  const handleSelect = (value) => {

    const selectedFeeData = feeData.find((item) => item.packaging === value);

    if (selectedFeeData) {
      setHandlingFeeRate(selectedFeeData.handling_fee_rate);
      setFeeCategory(selectedFeeData.fee_category);
      setStorageFeeRate(selectedFeeData.storage_fee_rate);
      setFeeID(selectedFeeData.id);
    } else {
      setHandlingFeeRate("");
      setFeeCategory("");
      setStorageFeeRate("");
    }
  }

  const getBySearch = (data) => {
    if (searchText) {
      return data.filter((item) => item.name.includes(searchText));
    } else {
      return data;
    }
  };
  const getShowData = () => {
    const res = getBySearch(allData);
    setShowData(res);
  }


  useEffect(() => {
    getAllProduct();
  }, [isposted]);

  useEffect(() => {
    getShowData();
    console.log(searchText)
    console.log("first", showData)
  }, [searchText]);

  useEffect(() => {
    getAllFeeData();
    getShowData();
  }, []);

  const onAction = async (item) => {
    if (item) {
      form.setFieldsValue({
        name: item.name,
        code: item.code,
        specification: item.specification,
        packaging: item.packaging,
      });
      setHandlingFeeRate(item.handling_fee_rate);
      setFeeCategory(item.fee_category);
      setStorageFeeRate(item.storage_fee_rate);
    } else {
      form.resetFields();
      setHandlingFeeRate("");
      setFeeCategory("");
      setStorageFeeRate("");
    }
    setIsModalOpen(true);
    setUpdateData(item);
  };

  const onDelete = async (item) => {
    try {
      const response = await axios.delete("http://127.0.0.1:3000/api/product", { data: { id: item.id } });
      setIsPosted(!isposted);
      notification.success({ message: "Delete Success.", duration: 1 });
    } catch (error) {
      notification.error({ message: "Server Error", duration: 1 });
    }
  };


  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const productListColumns = [
    {
      title: "No",
      dataIndex: "key",
      sorter: true,
      align: "center",
      width: "5%",
    },
    {
      title: `${message.Maintenance.productName}`,
      key: 'name',
      width: '20%',
      dataIndex: "name",
      align: 'center',
      // render: (text, record, dataIndex) => {
      //   return (
      //     <div>
      //       {record.name.slice(0, 18)}
      //       {text.length >= 18 ? "..." : ""}
      //     </div>
      //   );
      // },
    },
    {
      title: `${message.Maintenance.handlingFee}`,
      dataIndex: "handling_fee_rate",
      key: 'handling_fee_rate',
      align: 'center',
      // render: (text, record, dataIndex) => {
      //   return (
      //     <div>
      //       {record.tel.slice(0, 18)}
      //       {text.length >= 18 ? "..." : ""}
      //     </div>
      //   );
      // },
    },
    {
      title: `${message.Maintenance.storageFee}`,
      dataIndex: "storage_fee_rate",
      key: 'storage_fee_rate',
      align: 'center',
      // render: (text, record, dataIndex) => {
      //   return (
      //     <div>
      //       {record.tel.slice(0, 18)}
      //       {text.length >= 18 ? "..." : ""}
      //     </div>
      //   );
      // },
    },
    {
      title: `${message.Maintenance.billingClass}`,
      dataIndex: "fee_category",
      align: 'center',
      key: 'fee_category',
      // render: (text, record, dataIndex) => {
      //   return (
      //     <div>
      //       {record.tel.slice(0, 18)}
      //       {text.length >= 18 ? "..." : ""}
      //     </div>
      //   );
      // },
    },
    {
      title: `${message.buttons.change}`,
      dataIndex: "operation",
      render: (text, record, dataIndex) => {
        return (
          <div className="flex justify-center">
            <div className="hidden rounded-full">
              {(star_color = record.done == true ? "text-yellow-500" : "")}
            </div>
            <div className="p-2 rounded-full cursor-pointer text-center">
              <PencilSquareIcon
                shape="circle"
                className="w-20"
                style={{ marginRight: "5px" }}
                onClick={() => {
                  setUpdateStatus("Edit");
                  onAction(record);
                }}
              />
            </div>
            <div className="p-2 rounded-full cursor-pointer items-center text-center">
              <TrashIcon
                shape="circle"
                className="w-20"
                onClick={() => {
                  onDelete(record);
                }}
              />
            </div>
          </div>
        );
      },
      align: "center",
    },
  ];


  return (
    <div>
      <NavbarSection />
      <Content
        style={{ width: 1024 }}
        className="mx-auto content-h"
      >
        <div>
          <div className="mt-5" >
            <div className="flex flex-row items-center">
              {/* <label style={{ width: '50px' }} >{message.Maintenance.productName}</label> */}
              <Input.Search
                value={searchText}
                className="w-190"
                placeholder={"Search"}
                onChange={handleSearchText}
              />
              <Button
                style={{ marginLeft: "640px" }}
                onClick={() => {
                  onAction();
                  setUpdateStatus("Create")
                }}>
                {message?.Maintenance?.addNew}
              </Button>
            </div>
            <Modal
              title={message.Maintenance.productMaster}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={[
                <Button key="ok" onClick={onSubmit}>
                  {message.Maintenance.register}
                </Button>,
                <Button key="cancel" onClick={handleCancel}>
                  {message.buttons.cancel}
                </Button>,
              ]}
            >
              <div>
                <Form
                  form={form}
                  size="middle"
                  scrollToFirstError
                  labelCol={{ span: 7 }}
                  labelAlign="left"
                >
                  <Form.Item
                    label={message.Maintenance.productName}
                    name={"name"}
                    rules={[{ required: true, message: `${message.tableCommon.warning}` }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={message.shipper.code}
                    name={"code"}
                    rules={[{ required: true, message: `${message.tableCommon.warning}` }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={message.Maintenance.productPacking}
                    name={"specification"}
                    rules={[{ required: true, message: `${message.tableCommon.warning}` }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={message.Maintenance.packing}
                    name={"packaging"}
                    rules={[{ required: true, message: `${message.tableCommon.warning}` }]}
                  >
                    <Select
                      options={[...feePackaging].map((item) => ({
                        key: item,
                        value: item,
                        label: item,
                      }))}
                      onChange={handleSelect}

                    />
                  </Form.Item>
                  <Form.Item
                    label={message.Maintenance.handlingFee}
                    rules={[{ required: true, message: `${message.tableCommon.warning}` }]}
                  >
                    <Input value={handlingFeeRate} />
                  </Form.Item>
                  <Form.Item
                    label={message.Maintenance.storageFee}
                    rules={[{ required: true, message: `${message.tableCommon.warning}` }]}
                  >
                    <Input value={storageFeeRate} />
                  </Form.Item>
                  <Form.Item
                    label={message.Maintenance.billingClass}
                    rules={[{ required: true, message: `${message.tableCommon.warning}` }]}
                  >
                    <Input value={feeCategory} />
                  </Form.Item>
                </Form>
              </div>
            </Modal>
          </div>
          <div className="mt-5">
            <CTable
              rowKey={(node) => node.key}
              dataSource={showData}
              columns={productListColumns}
              pagination={true}
            />
          </div>
        </div>
      </Content>
      <FooterSection />
    </div>
  );
};
export default ProductList;
