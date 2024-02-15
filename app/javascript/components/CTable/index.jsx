import React, { useEffect, useState } from "react";
import { Table, Pagination } from "antd";
import PropTypes from "prop-types";
const CTable = (props) => {
  const [page, setPage] = useState({ pn: 1, ps: 10 });
  const [data, setData] = useState([]);
  const { pn, ps } = page;

  useEffect(() => {
    let s = [];
    for (
      let i = (pn - 1) * ps;
      i <
      (pn * ps < props?.dataSource?.length
        ? pn * ps
        : props.dataSource?.length);
      i++
    ) {
      s.push({ ...props?.dataSource[i], no: i + 1 });
    }
    setData(s);
  }, [props.dataSource, props.flag, pn, ps]);

  useEffect(() => {
    if (props.toFirstPane) setPage({ ...page, pn: 1 });
  }, [props]);

  return (
    <div className="flex h-full flex-col w-full">
      <Table
        loading={!data.length}
        {...props}
        dataSource={data}
        sticky
        pagination={false}
        className="h-full overflow-auto pr-1"
      />
      <div className="flex justify-center w-full bg-base-200 rounded-md mt-5">

      </div>
    </div>
  );
};

CTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
};

export default CTable;
