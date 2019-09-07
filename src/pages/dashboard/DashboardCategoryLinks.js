import React from 'react';

import DashboardCategoryLink from './DashboardCategoryLink';

class DashboardCategoryLinks extends React.Component {
  render() {
    const {categories} = this.props;
    const renderedCategoryLinks = categories.map((category, index) => {
      return (
        <div className="b-dashboard-category-links__item" key={category.name}>
          <DashboardCategoryLink name={category.name}
                                 text={category.text}
                                 onSwitch={this.props.onSwitch}
                                 activeCategory={this.props.activeCategory}
                                 leftMost={index === 0}
                                 rightMost={index + 1 === categories.length}
          />
        </div>
      );
    });
    return (
        <div className="b-dashboard-category-links">
          {renderedCategoryLinks}
        </div>
    );
  }
}

DashboardCategoryLinks.propTypes = {
  categories: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired
      })
  ),
  activeCategory: React.PropTypes.string.isRequired,
  onSwitch: React.PropTypes.func.isRequired
};

export default DashboardCategoryLinks;
