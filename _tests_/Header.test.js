import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import App from '../client/src/components/App.jsx';
import Event from '../client/src/components/Event.jsx';

describe('<App/>', () => {
  it('renders 1 component <App/> ', () => {
    const wrapper = shallow(<App/>);
    expect(wrapper.find('div')).to.have.lengthOf(1)
  });
});

describe('<Event/>', () => {
  it('renders 1 component <Event/> ', () => {
    const wrapper = shallow(<Event/>);
    expect(wrapper.find('div')).to.have.lengthOf(1)
  });
});
