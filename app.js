const vDom = (tag) => (attributes, children) => {
  
  if (!attributes || !attributes.id) {
    throw new Error("Copnent needs an Id");
  }

  return {
    tag,
    attributes,
    children,
  };
};

const div = vDom("div");
const h1 = vDom("h1");
const p = vDom("p");

const app = (state) =>
  div({ id: "main" }, [
    div({ id: "header" }, [
      h1({ id: "title" }, `Hello ${state.namex}`),
      p({ id: "static" }, "Static Content"),
    ]),
  ]);

const setAttributes = (element, attrs) => {
  return Object.keys(attrs).forEach(key => element.setAttribute(key, attrs[key]));
};



const render = ({ tag, children = "", attributes = {} }) => {
  const element = document.createElement(tag);

  setAttributes(element, attributes);

  if (typeof children === "string") {
    element.innerHTML = children;
  } else {
    children.map(render).forEach(element.appendChild.bind(element));
  }

  return element;
};

const areObjectsDiffernt = (a, b) => {
  const allKeys = Array.from(new Set([...Object.keys(a), Object.keys(b)]));

  return allKeys.some((k) => a[k] !== b[k]);
};

const areNodesDifferent = (a, b) => {
  if (!a || !b || a.tag !== b.tag) return true;

  const typeA = typeof a.children;
  const typeB = typeof b.children;

  return (
    typeA !== typeB ||
    areObjectsDiffernt(a, b) ||
    (typeA === "string" && a.children != b.children)
  );
};

const differentAndRender = (previousNode, currentNode) => {
  if (areNodesDifferent(currentNode, previousNode)) {
    const nodeId = currentNode.attributes.id;
    previousNode.children = currentNode;
    return document
      .querySelector(`#${nodeId}`)
      .replaceWith(render(currentNode));
  } else {
    currentNode.children.forEach((currChildNode, index) => {
      differentAndRender(previousNode.children[index], currChildNode);
    });
  }
};

let namex = "Ahmed Elkoumey";

const virtualDOMTree = app({ namex });

const root = document.querySelector("#root");

root.appendChild(render(virtualDOMTree));


setInterval(() => {
  namex = (namex === "Ahmed Elkoumey") ? "I'm Front-End Developer" : "Ahmed Elkoumey";

  let newVDom = app({ namex });
  differentAndRender(virtualDOMTree, newVDom);
}, 2000);
