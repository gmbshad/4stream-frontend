import React from 'react';
import classNames from 'classnames';

class DashboardCategoryLink extends React.Component {

  constructor(props) {
    super(props);
    this.activate = this.activate.bind(this);
  }

  activate() {
    this.props.onSwitch(this.props.name);
  }

  render() {
    const classes = classNames({
      'b-dashboard-category-link': true,
      'b-dashboard-category-link--leftmost': this.props.leftMost,
      'b-dashboard-category-link--rightmost': this.props.rightMost,
      'b-dashboard-category-link--active': this.props.name === this.props.activeCategory
    });

    return (
        <div className={classes} onClick={this.activate}>
          {this.props.text}
        </div>
    );
  }
}

DashboardCategoryLink.propTypes = {
  text: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  onSwitch: React.PropTypes.func.isRequired,
  leftMost: React.PropTypes.bool,
  rightMost: React.PropTypes.bool,
  activeCategory: React.PropTypes.string.isRequired
};

export default DashboardCategoryLink;
