import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import  Header  from '../client/src/Header.jsx';
import Events from '../client/src/Events.jsx';


describe('<Header/>', () => {
  it('renders 1 component <Header /> ', () => {
    const wrapper = shallow(<Header/>);
    expect(wrapper.find('div')).to.have.lengthOf(1)
  });
});

describe('<Events/>', () => {
  it('renders 1 component <Events /> ', () => {
    const wrapper = shallow(<Events/>);
    expect(wrapper.find('div')).to.have.lengthOf(2)
  });
});

