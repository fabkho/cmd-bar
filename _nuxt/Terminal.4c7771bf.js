import{u as m}from"./index.76ae8092.js";import{d as v,r as h,I as y,b as s,c as o,J as i,f as p,e,F as f,ah as k,p as C,i as b,t as g,k as x}from"./entry.4584a8c6.js";const n=t=>(C("data-v-514c5c3b"),t=t(),b(),t),I={key:0,class:"copied"},S=n(()=>e("div",{class:"scrim"},null,-1)),w=n(()=>e("div",{class:"content"}," Copied! ",-1)),B=[S,w],T=n(()=>e("div",{class:"header"},[e("div",{class:"controls"},[e("div"),e("div"),e("div")]),e("div",{class:"title"}," Bash ")],-1)),F={class:"window"},N=n(()=>e("span",{class:"sign"},"$",-1)),V={class:"content"},j={key:1,class:"prompt"},q=v({__name:"Terminal",props:{content:{type:[Array,String],required:!0}},setup(t){const a=t,{copy:_}=m(),c=h("init"),r=y(()=>typeof a.content=="string"?[a.content]:a.content),l=u=>{_(r.value.join(`
`)).then(()=>{c.value="copied",setTimeout(()=>{c.value="init"},1e3)}).catch(()=>{console.warn("Couldn't copy to clipboard!")})};return(u,A)=>(s(),o("div",{class:"terminal",onClick:l},[i(c)==="copied"?(s(),o("div",I,B)):p("",!0),T,e("div",F,[(s(!0),o(f,null,k(i(r),d=>(s(),o("span",{key:d,class:"line"},[N,e("span",V,g(d),1)]))),128))]),i(c)!=="copied"?(s(),o("div",j," Click to copy ")):p("",!0)]))}});const J=x(q,[["__scopeId","data-v-514c5c3b"]]);export{J as default};
