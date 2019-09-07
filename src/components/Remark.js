import React from 'react';
import classNames from 'classnames';

export default class Remark extends React.Component {
  render() {
    const {lines, onClick} = this.props;
    const clickable = onClick !== undefined;
    const linesElements = lines.map((line) => {
      const remarkLineClasses = classNames({
        'b-remark-line': true,
        'b-remark-line--indent': line.indent,
        'b-remark-line--center': line.center
      });
      return (
          <div className={remarkLineClasses} key={line.text}>{line.text}&nbsp;</div>
      );
    });
    const remarkClasses = classNames({
      'b-remark': true,
      'b-remark--clickable': clickable
    });
    const clickHandler = clickable ? onClick : () => {};
    return (
        <div className={remarkClasses} onClick={clickHandler}>
          {linesElements}
        </div>
    );
  }
}

Remark.propTypes = {
  onClick: React.PropTypes.func,
  lines: React.PropTypes.arrayOf(React.PropTypes.shape({
    text: React.PropTypes.string.isRequired,
    center: React.PropTypes.bool,
    indent: React.PropTypes.bool
  }))
};

