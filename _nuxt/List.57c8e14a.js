import{d as r,a0 as l,I as u,N as n,a8 as p,k as _}from"./entry.e6c70561.js";import{_ as m}from"./MDCSlot.45952a54.js";import{u as d,f}from"./node.676c5e99.js";const y=()=>({unwrap:d,flatUnwrap:f}),h={primary:"heroicons-outline:check",info:"heroicons-outline:information-circle",success:"heroicons-outline:check-circle",warning:"heroicons-outline:exclamation",danger:"heroicons-outline:exclamation-circle"},g=r({props:{icon:{type:String,default:null},type:{type:String,default:"primary",validator:e=>["primary","info","success","warning","danger"].includes(e)}},setup(e){const a=l(),{flatUnwrap:o,unwrap:s}=y(),i=u(()=>e.icon||h[e.type]);return()=>{const c=o((a.default&&a.default())??[],["ul"]).map(t=>s(t,["li"]));return n("ul",c.map(t=>n("li",[n("span",{class:`list-icon ${e.type}`},n(p,{name:i.value,class:"icon"})),n("span",n(m,{use:()=>t}))])))}}});const k=_(g,[["__scopeId","data-v-1d73b624"]]);export{k as default};
