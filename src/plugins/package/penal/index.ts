import BpmnPropertiesPanel from "./PropertiesPanel.vue";

// @ts-ignore
BpmnPropertiesPanel.install = function(Vue) {
  Vue.component(BpmnPropertiesPanel.name, BpmnPropertiesPanel);
};

export default BpmnPropertiesPanel;
