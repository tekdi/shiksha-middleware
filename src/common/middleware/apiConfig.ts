export const apiMappings = {
  identifier1: {
    // microservice: 'http://3.109.46.84:4000',
    microservice: 'http://localhost:3000',
    endpoint: 'event/v1/{dynamicParam}',
    permission: ['event.read'],
    method: 'GET',
  },
  identifier2: {
    microservice: 'http://3.109.46.84:4000',
    // microservice: 'http://localhost:3000',
    endpoint: 'event/v1/{dynamicParam}',
    permission: ['event.delete'],
    method: 'DELETE',
  },
  identifier3: {
    microservice: 'http://3.109.46.84:4000',
    // microservice: 'http://localhost:3000',
    endpoint: 'event/v1/create',
    permission: ['event.create'],
    method: 'POST',
  },
  identifier4: {
    microservice: 'http://3.109.46.84:4000',
    // microservice: 'http://localhost:3000',
    endpoint: 'event/v1/{dynamicParam}',
    permission: ['event.update'],
    method: 'PATCH',
  },
  identifier5: {
    microservice: 'http://3.109.46.84:4000',
    // microservice: 'http://localhost:3000',
    endpoint: 'event/v1/list',
    permission: ['event.read'],
    method: 'POST',
  },
  identifier6: {
    microservice: 'https://qa.prathamteacherapp.tekdinext.com',
    // microservice: 'http://localhost:3000',
    endpoint: 'api/v1/cohorts/{dynamicParam}',
    permission: ['event.read'],
    method: 'GET',
  },
};
