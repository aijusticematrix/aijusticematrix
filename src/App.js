import './App.css';
import { data } from './data.js';
import { Graph } from "react-d3-graph";
import { useForm, useField, splitFormProps } from "react-form";
import React from "react";
import RelatedNetwork from "./RelatedNetwork";
import { DataSet } from "vis-data";



function validateAddressStreet(value) {
  if (!value) {
    return "A street is required";
  }
  return false;
}

function SelectField(props) {
  const [field, fieldOptions, { options, ...rest }] = splitFormProps(props);

  const {
    value = "",
    setValue,
    meta: { error, isTouched }
  } = useField(field, fieldOptions);

  const handleSelectChange = e => {
    setValue(e.target.value);
  };

  return (
    <>
      <select {...rest} value={value} onChange={handleSelectChange}>
        <option disabled value="" />
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>{" "}
      {isTouched && error ? <em>{error}</em> : null}
    </>
  );
}

const InputField = React.forwardRef((props, ref) => {
  // Let's use splitFormProps to get form-specific props
  const [field, fieldOptions, rest] = splitFormProps(props);

  // Use the useField hook with a field and field options
  // to access field state
  const {
    meta: { error, isTouched, isValidating },
    getInputProps
  } = useField(field, fieldOptions);

  // Build the field
  return (
    <>
      <input {...getInputProps({ ref, ...rest })} />{" "}
      {isValidating ? (
        <em>Validating...</em>
      ) : isTouched && error ? (
        <em>{error}</em>
      ) : null}
    </>
  );
});


const InputArea = React.forwardRef((props, ref) => {
  // Let's use splitFormProps to get form-specific props
  const [field, fieldOptions, rest] = splitFormProps(props);

  // Use the useField hook with a field and field options
  // to access field state
  const {
    meta: { error, isTouched, isValidating },
    getInputProps
  } = useField(field, fieldOptions);

  // Build the field
  return (
    <>
      <textarea {...getInputProps({ ref, ...rest })} />{" "}
      {isValidating ? (
        <em>Validating...</em>
      ) : isTouched && error ? (
        <em>{error}</em>
      ) : null}
    </>
  );
});


function MyForm(props) {
  // Use the useForm hook to create a form instance
  const {
    Form,
    meta: { isSubmitting, canSubmit }
  } = useForm({
    onSubmit: async (values, instance) => {
      // onSubmit (and everything else in React Form)
      // has async support out-of-the-box
      await props.addMessageToNode(props.selectedNode, values.message);
      console.log(values, "Huzzah!");
    },
    debugForm: false
  });

  return (
    <Form>
        {!props.selectedNode && 
      <div>
        <label>
            New node name: {" "}
            <InputField field="new_node" />
          </label>
        </div>
      }
      <div>
        <label>
          Message: {" "}
          <InputArea field="message" />
        </label>
      </div>

      <div>
        <label>
          Optionally Link to an existing node: 
          <SelectField
            field="favoriteColor"
            options={props.node_names}
          />
        </label>
      </div>
      <div>
        <button type="submit" disabled={!canSubmit}>
          Submit
        </button>
      </div>

      <div>
        <em>{isSubmitting ? "Submitting..." : null}</em>
      </div>
    </Form>
  );
}

// view selected node
// view subheadings for each edge leaving the node
var nodes = new DataSet([
  {"id": "Power", "label": "Power", "type": "Primary", "text": "Hi, this is me posting about power!"},
  {"id": "Technology", "label": "Technology","type": "Primary"},
  {"id": "Justice", "label": "Justice","type": "Primary"},
  {"id": "Industry", "label": "Industry","type": "Primary"},
  {"id": "State", "label": "State", "type": "Secondary"},
  {"id": "Surveillance", "label": "Surveillance", "type": "Secondary"},
  {"id": "Education", "label": "Education", "type": "Secondary"},
  {"id": "Epistemologies", "label": "Epistemologies", "type": "Secondary"},
  {"id": "Policy", "label": "Policy", "type": "Secondary"},
  {"id": "Indivual", "label": "Indivual", "type": "Secondary"},
  {"id": "Citizen", "label": "Citizen", "type": "Secondary"},
  {"id": "Algorithms", "label": "Algorithms", "type": "Secondary"},
  {"id": "Police", "label": "Police", "type": "Secondary"},
  {"id": "Software", "label": "Software", "type": "Secondary"},
  {"id": "Transparency", "label": "Transparency", "type": "Secondary"},
  {"id": "Hardware", "label": "Hardware", "type": "Secondary"},
  {"id": "Legibility", "label": "Legibility", "type": "Secondary"},
  {"id": "Accessibility", "label": "Accessibility", "type": "Secondary"},
  {"id": "Accountability", "label": "Accountability", "type": "Secondary"},
  {"id": "Corporations", "label": "Corporations", "type": "Secondary"},
  {"id": "Money", "label": "Money", "type": "Secondary"},
  {"id": "Undocumented migrants", "label": "Undocumented migrants", "type": "Secondary"},
  {"id": "Border control", "label": "Border control", "type": "Secondary"}
  ]);

  // create an array with edges
  var edges = new DataSet([
  {"from": "Power","to": "State","label": "link 1 and 2"},
  {"from": "Power","to": "State","label": "second edge"},
  {"from": "Police","to": "Surveillance"},
  {"from": "State","to": "Police"},
  {"from": "Power","to": "Education"},
  { "from": "Education", "to": "Epistemologies" },
  { "from": "Power", "to": "Policy" },
  { "from": "Power", "to": "Indivual" },
  { "from": "Indivual", "to": "Citizen" },
  { "from": "Power", "to": "Undocumented migrants" },
  { "from": "Undocumented migrants", "to": "Border control" },
  { "from": "Technology", "to": "Algorithms" },
  { "from": "Algorithms", "to": "Transparency" },
  { "from": "Technology", "to": "Surveillance" },
  { "from": "Surveillance", "to": "Police" },
  { "from": "Technology", "to": "Software" },
  { "from": "Technology", "to": "Hardware" },
  { "from": "Justice", "to": "Transparency" },
  { "from": "Justice", "to": "Legibility" },
  { "from": "Justice", "to": "Accessibility" },
  { "from": "Justice", "to": "Accountability" },
  { "from": "Industry", "to": "Corporations" },
  { "from": "Industry", "to": "Money" }
  ]);


  async function getDataFromServer (data) {

    await new Promise(resolve => setTimeout(resolve, 1000));
    return data;
  }
  
function Message (props) {
  return (
    <li>{props.text}</li>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {nodes: [], edges: [], selectedNode: null};
    this.changeSelectedNode = this.changeSelectedNode.bind(this);
    this.addMessageToNode = this.addMessageToNode.bind(this);
  }


  getNodes () {
    fetch('http://66.29.140.14:3000/nodes')
    .then(res => res.json())
    .then((data) => {
      this.setState({ nodes: data })
    })
    .catch(console.log)
  }

  getEdges () {
    fetch('http://66.29.140.14:3000/links')
    .then(res => res.json())
    .then((data) => {
      this.setState({ edges: data })
    })
    .catch(console.log)
  }
  
  componentDidMount() {
      this.getNodes();
      this.getEdges();
  }

  setNode(selectedNode) {
  }
  
  changeSelectedNode(selectedNode) {
    const nodeObject = this.state.nodes.find(node => node.id === selectedNode);
    this.setState({ selectedNode: nodeObject});
    console.log(nodeObject);
  }

  postNodeToServer(selectedNode, message){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: "Hierarchy", label:"Hierarchy" })
  };
    fetch('http://66.29.140.14:3000/nodes', requestOptions)
        .then(response => response.json())
        .then(data => console.log("post success", data));
  }

  updateNodeToServer(selectedNode, message){
    const messages = selectedNode.messages ? selectedNode.messages : []; 
    
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedNode.id, label:selectedNode.label, messages: messages.concat(message) })
  };
    fetch('http://66.29.140.14:3000/nodes/' + selectedNode.id, requestOptions)
        .then(response => response.json())
        .then(data => console.log("update success")); 
  }

  addMessageToNode(selectedNode, message){
    this.updateNodeToServer(selectedNode, message);
  }

  render () {
    return (
      <div className="App">
        <div className="graph" style={{ float:`left` }}>
          <RelatedNetwork
            nodes= {this.state.nodes}
            edges= {this.state.edges}
            changeSelectedNode = {this.changeSelectedNode}
          />
        </div>
        <div className="form" style={{ float:`right` }}>
          <header className="selectedNode"> {this.state.selectedNode ? "Selected Node: " + this.state.selectedNode?.id : "Create a new node"} </header>
          {this.state.selectedNode?.messages?.map(message => 
          <Message
          text={message}
          />
          )}
          <MyForm
            selectedNode={this.state.selectedNode}
            addMessageToNode = {this.addMessageToNode}  
            node_names = {this.state.nodes.map (n => n.id)}
          />
        </div>
      </div>
    );
  }
}

export default App;
