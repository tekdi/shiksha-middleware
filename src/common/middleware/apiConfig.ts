'use strict';

/**
 * @file - Sourcing Portal Backend API(s) list
 * @description - Whitelisted URL(s)
 * @since release-4.1.0
 * @version 1.0
 */
export const apiList = {
  //user-service
  '/user/v1/create': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.read'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/read/:userId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.read'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/update/:userId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.update'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/delete/:userId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.delete'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  //--------------
  '/user/v1/list': {
    checksNeeded: ['ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.delete'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  //attendance
  '/user/v1/attendance': {
    checksNeeded: ['ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/attendance/list': {
    checksNeeded: ['ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/attendance/bulkAttendance': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  //cohort
  '/user/v1/cohort/cohortHierarchy': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/cohort/create': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/cohort/search': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/cohort/update/:cohortId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/cohort/delete/:cohortId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/cohort/mycohorts/:userId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  //cohort member
  '/user/v1/cohortmember/create': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/cohortmember/read/:cohortId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/cohortmember/list': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/cohortmember/update/:cohortmembershipid': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/cohortmember/delete/:id': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/cohortmember/bulkcreate': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  //AssignTenant
  '/user/v1/assign-tenant': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  //rbac
  '/user/v1/rbac/roles/read/:id': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/rbac/roles/create': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/rbac/roles/update/:id': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/rbac/roles/list/roles': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/rbac/roles/delete/:roleId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/rbac/privileges': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/rbac/privileges/:privilegeId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/rbac/privileges/create': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/rbac/usersRoles': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/rbac/usersRoles/:userId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/assignprivilege': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/user/v1/assignprivilege/:roleId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  //event-service
  //event
  '/event-service/event/v1/create': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/event-service/event/v1/list': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/event-service/event/v1/:id': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  //event-attendance
  '/event-service/attendees/v1/create': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/event-service/attendees/v1/list': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/event-service/attendees/v1': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },

  //notification-service
  //notification templates
  '/notification-templates': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/notification-templates/list': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/notification-templates/:id': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  //notification-send
  '/notification/send': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/notification/sendTopicNotification': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  //notification-queue
  '/queue': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/queue/list': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/queue/:id': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },

  //tracking-service
  //tracking
  '/v1/tracking/assessment/read/:assessmentTrackingId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/v1/tracking/assessment/create': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/v1/tracking/assessment/search': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/v1/tracking/assessment/search/status': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/v1/tracking/assessment/list': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/v1/tracking/assessment/delete/:assessmentTrackingId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  //content
  '/v1/tracking/content/read/:contentTrackingId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/v1/tracking/content/create': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/v1/tracking/content/search': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/v1/tracking/content/search/status': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/v1/tracking/content/list': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
  '/v1/tracking/content/delete/:contentTrackingId': {
    checksNeeded: ['PRIVILEGE_CHECK', 'ROLE_CHECK'],
    PRIVILEGE_CHECK: ['users.create'],
    ROLE_CHECK: ['teacher', 'admin', 'team_leader'],
  },
};

export const urlPatterns = [
  //user-service
  //user
  '/user/v1/create',
  '/user/v1/read/:userId',
  '/user/v1/update/:userId',
  '/user/v1/delete/:userId',
  //attendance
  '/user/v1/attendance',
  '/user/v1/attendance/list',
  '/user/v1/attendance/bulkAttendance',
  //cohort
  '/user/v1/cohort/cohortHierarchy',
  '/user/v1/cohort/create',
  '/user/v1/cohort/search',
  '/user/v1/cohort/update/:cohortId',
  '/user/v1/cohort/delete/:cohortId',
  '/user/v1/cohort/mycohorts/:userId',
  //cohort member
  '/user/v1/cohortmember/create',
  '/user/v1/cohortmember/read/:cohortId',
  '/user/v1/cohortmember/list',
  '/user/v1/cohortmember/update/:cohortmembershipid',
  '/user/v1/cohortmember/delete/:id',
  '/user/v1/cohortmember/bulkcreate',
  //AssignTenant
  '/user/v1/assign-tenant',
  //rbac
  '/user/v1/rbac/roles/read/:id',
  '/user/v1/rbac/roles/create',
  '/user/v1/rbac/roles/update/:id',
  '/user/v1/rbac/roles/list/roles',
  '/user/v1/rbac/roles/delete/:roleId',
  '/user/v1/rbac/privileges',
  '/user/v1/rbac/privileges/:privilegeId',
  '/user/v1/rbac/privileges/create',
  '/user/v1/rbac/usersRoles',
  '/user/v1/rbac/usersRoles/:userId',
  '/user/v1/assignprivilege',
  '/user/v1/assignprivilege/:roleId',

  //event-service
  //event
  '/event-service/event/v1/create',
  '/event-service/event/v1/list',
  '/event-service/event/v1/:id',
  //event-attendance
  '/event-service/attendees/v1/create',
  '/event-service/attendees/v1/list',
  '/event-service/attendees/v1',

  //notification-service
  //notification templates
  '/notification-templates',
  '/notification-templates/list',
  '/notification-templates/:id',
  //notification-send
  '/notification/send',
  '/notification/sendTopicNotification',
  //notification-queue
  '/queue',
  '/queue/list',
  '/queue/:id',

  //tracking-service
  //tracking
  '/v1/tracking/assessment/read/:assessmentTrackingId',
  '/v1/tracking/assessment/create',
  '/v1/tracking/assessment/search',
  '/v1/tracking/assessment/search/status',
  '/v1/tracking/assessment/list',
  '/v1/tracking/assessment/delete/:assessmentTrackingId',
  //content
  '/v1/tracking/content/read/:contentTrackingId',
  '/v1/tracking/content/create',
  '/v1/tracking/content/search',
  '/v1/tracking/content/search/status',
  '/v1/tracking/content/list',
  '/v1/tracking/content/delete/:contentTrackingId',
];

function convertToRegex(pattern) {
  const regexString = pattern.replace(/:[^\s/]+/g, '([\\w-]+)');
  return new RegExp(`^${regexString}$`);
}

export const regexPatterns = urlPatterns.map(convertToRegex);
