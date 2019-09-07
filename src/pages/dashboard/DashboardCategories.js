import React from 'react';

import {DashboardContent} from './DashboardContent';
import DashboardCategoryLinks from './DashboardCategoryLinks';
import {navigateTo} from '../../utils/NavigationUtils';

export default class DashboardCategories extends DashboardContent {

  constructor(props) {
    super(props);
    this.onCategorySwitch = this.onCategorySwitch.bind(this);
  }

  getRoute() {
    console.error('getRoute() must be overridden in subclass');
  }

  getCategories() {
    console.error('getCategories() must be overridden in subclass');
  }

  getDefaultCategory() {
    console.error('getDefaultCategory() must be overridden in subclass');
  }

  getCurrentCategory() {
    const {category} = this.props;
    const categoryNames = this.getCategories().map((categ) => categ.name);
    if ((categoryNames.find((value) => { return value === category; })) !== undefined) {
      return category;
    }
    return this.getDefaultCategory();
  }
  
  onCategorySwitch(nextCaterogy) {
    if (this.getCurrentCategory() !== nextCaterogy) {
      navigateTo(this.getRoute() + nextCaterogy);
    }
  }

  renderCategoryLinks() {
    const categories = this.getCategories().map((category) => {
      return {
        name: category.name,
        text: category.text
      };
    });
    return (
      <DashboardCategoryLinks categories={categories}
                              activeCategory={this.getCurrentCategory()}
                              onSwitch={this.onCategorySwitch}/>
    );
  }

  renderCategory() {
    const categories = this.getCategories();
    const currentCategory = this.getCurrentCategory();
    const category = categories.find((categ) => categ.name === currentCategory);
    return category.element;
  }

  renderContent() {
    return (
        <div className="b-dashboard-categorized-content">
          <div className="b-dashboard-categorized-content__categories">
            {this.renderCategoryLinks()}
          </div>
          <div className="b-dashboard-categorized-content__content">
            {this.renderCategory()}
          </div>
        </div>
    );
  }
}

DashboardCategories.propTypes = {
  category: React.PropTypes.string
};
