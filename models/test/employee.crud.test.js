const expect = require('chai').expect;

const mongoose = require('mongoose');
const Employee = require('../employee.model');
const Department = require('../department.model');

describe('Employee', () => {

  before(async () => {

    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.error(err);
    }
  });
  describe('Reading data', () => {

    before(async () => {
      const testEmpOne = new Employee({ firstName: 'Firstname #1', lastName: 'Lastname #1', department: 'Department #1' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Firstname #2', lastName: 'Lastname #2', department: 'Department #2' });
      await testEmpTwo.save();
    });
  
    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "firstName" with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Firstname #1' });
      const expectedName = 'Firstname #1';
      expect(employee.firstName).to.be.equal(expectedName);
    });

    it('should return a proper document by "lastName" with "findOne" method', async () => {
      const employee = await Employee.findOne({ lastName: 'Lastname #1' });
      const expectedName = 'Lastname #1';
      expect(employee.lastName).to.be.equal(expectedName);
    });

    it('should return a proper document by "department" with "findOne" method', async () => {
      const employee = await Employee.findOne({ department: 'Department #1' });
      const expectedName = 'Department #1';
      expect(employee.department).to.be.equal(expectedName);
    });
  
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'Firstname #1', lastName: 'Lastname #1', department: 'Department #1' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  
  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Firstname #1', lastName: 'Lastname #1', department: 'Department #1' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Firstname #2', lastName: 'Lastname #2', department: 'Department #2' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });


    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'Firstname #1' }, { $set: { firstName: '=Firstname #1=' }});
      const updatedEmployee = await Employee.findOne({ firstName: '=Firstname #1=' } );
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Firstname #1' });
      employee.firstName = '=Firstname #1=';
      await employee.save();

      const updatedEmployee = await Employee.findOne({ firstName: '=Firstname #1=' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Update many!' }});
      const updatedEmployees = await Employee.find({ firstName: 'Update many!' });
      expect(updatedEmployees.length).to.be.equal(2);
    });
    
  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Firstname #1', lastName: 'Lastname #1', department: 'Department #1' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Firstname #2', lastName: 'Lastname #2', department: 'Department #2' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });


    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Firstname #1' });
      const deletedEmployee = await Employee.findOne({ firstName: 'Firstname #1' });
      expect(deletedEmployee).to.be.null;
    });
  
    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Firstname #1' });
      await employee.remove();

      const deletedEmployee = await Employee.findOne({ firstName: 'Firstname #1' });
      expect(deletedEmployee).to.be.null;
    });
  
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const deletedEmployees = await Employee.find();
      expect(deletedEmployees.length).to.be.equal(0);
    });
  
  });

  describe('Populated data', () => {
    
    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();
      const testDepOneId = await Department.findOne({ name: 'Department #1' });

      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();
      const testDepTwoId = await Department.findOne({ name: 'Department #2' });

      const testEmpOne = new Employee({ firstName: 'Firstname #1', lastName: 'Lastname #1', department: testDepOneId._id });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Firstname #2', lastName: 'Lastname #2', department: testDepTwoId._id });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

    it('should properly populate one document with "populate" method', async () => {
      const employee = await Employee.findOne({firstName: 'Firstname #1'}).populate('department');
      expect(employee.department).to.be.an('object');
    });

  });

  after(() => {
    mongoose.models = {};
  });

});