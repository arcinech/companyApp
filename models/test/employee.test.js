const expect = require('chai').expect;
const Employee = require('../employee.model');
const mongoose = require('mongoose');

describe('Employee', () => {
  
  it('should throw an error if no "firstName" arg', () => {
    const emp = new Employee({}); // create new Employee, but don't set `firstName` attr value

    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
    });
  });

  it('should throw an error if no "lastName" arg', () => {
    const emp = new Employee({}); // create new Employee, but don't set `lastName` attr value

    emp.validate(err => {
      expect(err.errors.lastName).to.exist;
    });
  });

  it('should throw an error if no "department" arg', () => {
    const emp = new Employee({}); // create new Employee, but don't set `lastName` attr value

    emp.validate(err => {
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if "firstName" is not a string', () => {

    const cases = [{}, []];
    for(let firstName of cases) {
      const emp = new Employee({ firstName });
  
      emp.validate(err => {
        expect(err.errors.firstName).to.exist;
      });
  
    }
  
  });

  it('should throw an error if "lastName" is not a string', () => {

    const cases = [{}, []];
    for(let lastName of cases) {
      const emp = new Employee({ lastName });
  
      emp.validate(err => {
        expect(err.errors.lastName).to.exist;
      });
  
    }
  
  });

  it('should throw an error if "department" is not a string', () => {

    const cases = [{}, []];
    for(let department of cases) {
      const emp = new Employee({ department });
  
      emp.validate(err => {
        expect(err.errors.department).to.exist;
      });
  
    }
  
  });

  it('should not throw an error if "name" is okay', () => {
    const emp = new Employee({ firstName: 'Lorem', lastName: 'Ipsum', department: '5c8f8f8f8f8f8f8f8f8f8f' });

    emp.validate(err => {
      expect(err).to.not.exist;
    });
  });

  after(() => {
    mongoose.models = {};
  });
});
