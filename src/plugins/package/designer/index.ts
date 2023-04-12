import BpmnProcessDesigner from "./ProcessDesigner.vue";

// @ts-ignore
BpmnProcessDesigner.install = function(Vue) {
  Vue.component(BpmnProcessDesigner.name, BpmnProcessDesigner);
};

export default BpmnProcessDesigner;
