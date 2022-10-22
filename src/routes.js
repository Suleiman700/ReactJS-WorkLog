/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/auth/Register.js";
import Login from "views/auth/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import JobsList from "views/jobs/JobsList";
import EditJob from "views/jobs/EditJob";
import NewJob from "views/jobs/NewJob";

import WorkDaysList from "views/workdays/WorkDaysList";
import EditWorkDay from "views/workdays/EditWorkDay";
import NewWorkDay from "views/workdays/NewWorkDay";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
    visibleInSideBar: true
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/admin",
    visibleInSideBar: true
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/admin",
    visibleInSideBar: true
  },
  {
    path: "/jobs/edit",
    name: "Edit Job",
    icon: "fa fa-edit text-green",
    component: EditJob,
    layout: "/admin",
    visibleInSideBar: false
  },
  {
    path: "/jobs/new",
    name: "New Job",
    icon: "fa fa-edit text-green",
    component: NewJob,
    layout: "/admin",
    visibleInSideBar: false
  },
  {
    path: "/jobs",
    name: "Jobs",
    icon: "ni ni-briefcase-24 text-green",
    component: JobsList,
    layout: "/admin",
    visibleInSideBar: true
  },
  {
    path: "/workdays/edit",
    name: "Work Days",
    icon: "fa fa-clock text-pink",
    component: EditWorkDay,
    layout: "/admin",
    visibleInSideBar: false
  },
  {
    path: "/workdays/new",
    name: "Work Days",
    icon: "fa fa-clock text-pink",
    component: NewWorkDay,
    layout: "/admin",
    visibleInSideBar: false
  },
  {
    path: "/workdays",
    name: "Work Days",
    icon: "fa fa-clock text-pink",
    component: WorkDaysList,
    layout: "/admin",
    visibleInSideBar: true
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
    visibleInSideBar: true
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin",
    visibleInSideBar: true
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
    visibleInSideBar: true
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
    visibleInSideBar: true
  }
];
export default routes;
