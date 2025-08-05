import React from "react";
import PropTypes from "prop-types";
import '../../assets/styles/style.scss';

const Tags = ({ name }) => {
  return (
    < div className="d-flex flex-wrap card-searchtags" >
      {name?.length > 0 && name?.map((item, index) => {
        return (item.length > 0 ?
          <span key={item} className="ovalCard cursor-pointer" title={item}>{item}</span> : null
        );
      })}
    </div>
  );
};

Tags.propTypes = {
  name: PropTypes.arrayOf(PropTypes.string),
};

export default Tags;
