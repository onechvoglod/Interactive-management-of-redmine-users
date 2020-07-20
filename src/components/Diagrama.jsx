import React from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import classes from "./Diagrama.module.scss";
import { useContext } from "react";
import { RedmineContext } from "../context/redmine/redmineContext";

const ingURL =
  "https://pm1.narvii.com/6889/74979d4d2744ec6e27995b6e866f091d04c0b40cr1-515-414v2_uhq.jpg";

let nodeDataArra = [];

let myDiagram;
function initDiagram() {
  const $ = go.GraphObject.make;
  // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
  myDiagram = $(go.Diagram, {
    maxSelectionCount: 100, //количество одновременно выбранных элементов
    validCycle: go.Diagram.CycleDestinationTree, // в узел может входить любое количество исходных ссылок, но не более одной целевой ссылки может выходить из узла

    "undoManager.isEnabled": true, // must be set to allow for model change listening
    // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
    // двойным щелчком создать новый узел
    "clickCreatingTool.archetypeNodeData": {
      // color: "lightblue",
      name: "(new person)",
      //   title: "",
      //   comments: "",
    },
    "clickCreatingTool.insertPart": function (loc) {
      // переместиться к нов-созданному узлу
      const node = go.ClickCreatingTool.prototype.insertPart.call(this, loc);
      if (node !== null) {
        this.diagram.select(node);
        this.diagram.commandHandler.scrollToPart(node);
        this.diagram.commandHandler.editTextBlock(node.findObject("NAMETB"));
      }
      return node;
    },
    layout: $(go.TreeLayout, {
      // определения размера и расположения коллекции объектов
      treeStyle: go.TreeLayout.StyleLastParents, // стандартный многоуровневый стиль дерева
      arrangement: go.TreeLayout.ArrangementHorizontal, // Получает или задает порядок расположения деревьев ( каждое дерево будет распологаться непересекающимся способом, увеличив координаты X)
      // properties for most of the tree:
      angle: 90, // угол: направление, в котором растет дерево, от родителя к ребенку;
      layerSpacing: 35, // расстояние между родительским и дочерним элементом
      // properties for the "last parents":
      alternateAngle: 90,
      alternateLayerSpacing: 35,
      alternateAlignment: go.TreeLayout.AlignmentBus, // относительная позиция родительского узла с его дочерними элементами
      alternateNodeSpacing: 20, // расстояние между узлами внутри слоя - между братьями и сестрами.
    }),
  });

  myDiagram.addDiagramListener("Modified", function (e) {
    var button = document.getElementById("SaveButton");
    if (button) button.disabled = !myDiagram.isModified;
    var idx = document.title.indexOf("*");
    if (myDiagram.isModified) {
      if (idx < 0) document.title += "*";
    } else {
      if (idx >= 0) document.title = document.title.substr(0, idx);
    }
  });

  myDiagram.addDiagramListener("SelectionDeleting", function (e) {
    var part = e.subject.first(); // e.subject is the myDiagram.selection collection,
    // so we'll get the first since we know we only have one selection
    myDiagram.startTransaction("clear boss");
    if (part instanceof go.Node) {
      var it = part.findTreeChildrenNodes(); // find all child nodes
      while (it.next()) {
        // now iterate through them and clear out the boss information
        const child = it.value;
        const bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
        if (bossText === null) return;
        bossText.text = "";
      }
    } else if (part instanceof go.Link) {
      const child = part.toNode;
      const bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
      if (bossText === null) return;
      bossText.text = "";
    }
    myDiagram.commitTransaction("clear boss");
  });

  var model = $(go.TreeModel);
  model.nodeDataArray = nodeDataArra;
  myDiagram.model = model;

  myDiagram.linkTemplate = $(
    go.Link,
    go.Link.Orthogonal,
    { corner: 5, relinkableFrom: true, relinkableTo: true },
    $(go.Shape, { strokeWidth: 2, stroke: "black" })
  );

  // Setup zoom to fit button
  document.getElementById("zoomToFit").addEventListener("click", function () {
    myDiagram.commandHandler.zoomToFit();
  });

  document.getElementById("centerRoot").addEventListener("click", function () {
    myDiagram.scale = 1;
    myDiagram.commandHandler.scrollToPart(myDiagram.findNodeForKey(1));
  });

  const levelColors = [
    "#AC193D",
    "#2672EC",
    "#8C0095",
    "#5133AB",
    "#008299",
    "#D24726",
    "#008A00",
    "#094AB2",
  ];

  myDiagram.layout.commitNodes = function () {
    go.TreeLayout.prototype.commitNodes.call(myDiagram.layout); // do the standard behavior
    // then go through all of the vertexes and set their corresponding node's Shape.fill
    // to a brush dependent on the TreeVertex.level value
    myDiagram.layout.network.vertexes.each(function (v) {
      if (v.node) {
        var level = v.level % levelColors.length;
        var color = levelColors[level];
        var shape = v.node.findObject("SHAPE");
        if (shape)
          shape.stroke = $(go.Brush, "Linear", {
            0: color,
            1: go.Brush.lightenBy(color, 0.05),
            start: go.Spot.Left,
            end: go.Spot.Right,
          });
      }
    });
  };

  function nodeDoubleClick(e, obj) {
    var clicked = obj.part;
    if (clicked !== null) {
      var thisemp = clicked.data;
      myDiagram.startTransaction("add employee");
      var newemp = {
        name: "(new person)",
        title: "",
        comments: "",
        parent: thisemp.key,
      };
      myDiagram.model.addNodeData(newemp);
      myDiagram.commitTransaction("add employee");
    }
  }

  function mayWorkFor(node1, node2) {
    if (!(node1 instanceof go.Node)) return false; // must be a Node
    if (node1 === node2) return false; // cannot work for yourself
    if (node2.isInTreeOf(node1)) return false; // cannot work for someone who works for you
    return true;
  }

  function textStyle() {
    return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
  }

  // define a simple Node template
  myDiagram.nodeTemplate = $(
    go.Node,
    "Auto",
    // new go.Binding("text", "text"),
    { doubleClick: nodeDoubleClick }, // the Shape will go around the TextBlock
    {
      mouseDragEnter: function (e, node, prev) {
        var diagram = node.diagram;
        var selnode = diagram.selection.first();
        if (!mayWorkFor(selnode, node)) return;
        var shape = node.findObject("SHAPE");
        if (shape) {
          shape._prevFill = shape.fill; // remember the original brush
          shape.fill = "darkred";
        }
      },
      mouseDragLeave: function (e, node, next) {
        var shape = node.findObject("SHAPE");
        if (shape && shape._prevFill) {
          shape.fill = shape._prevFill; // restore the original brush
        }
      },
      mouseDrop: function (e, node) {
        var diagram = node.diagram;
        var selnode = diagram.selection.first(); // assume just one Node in selection
        if (mayWorkFor(selnode, node)) {
          // find any existing link into the selected node
          var link = selnode.findTreeParentLink();
          if (link !== null) {
            // reconnect any existing link
            link.fromNode = node;
          } else {
            // else create a new link
            diagram.toolManager.linkingTool.insertLink(
              node,
              node.port,
              selnode,
              selnode.port
            );
          }
        }
      },
    },
    // for sorting, have the Node.text be the data.name
    new go.Binding("text", "name"),
    // bind the Part.layerName to control the Node's layer depending on whether it isSelected
    new go.Binding("layerName", "isSelected", function (sel) {
      return sel ? "Foreground" : "";
    }).ofObject(),
    // define the node's outer shape

    // new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
    //   go.Point.stringify
    // ),
    $(go.Shape, "Rectangle", {
      name: "SHAPE",
      fill: "#333333",
      stroke: "white",
      strokeWidth: 3.5,
      portId: "",
      fromLinkable: true,
      toLinkable: true,
      cursor: "pointer",
    }),

    $(
      go.Panel,
      "Horizontal",
      $(
        go.Picture,
        // { margin: 10, width: 50, height: 50, background: "red" },
        {
          name: "Picture",
          desiredSize: new go.Size(70, 70),
          margin: 1.5,
        },
        new go.Binding("source")
      ),

      $(
        go.Panel,
        "Table",
        {
          minSize: new go.Size(170, NaN),
          // maxSize: new go.Size(150, NaN),
          margin: new go.Margin(6, 10, 0, 6),
          defaultAlignment: go.Spot.Left,
        },
        $(go.RowColumnDefinition, { column: 2, width: 4 }),
        $(
          go.TextBlock,
          textStyle(),
          // "stretch: Horizontal",
          {
            row: 0,
            column: 0,
            columnSpan: 5,
            // stretch: go.GraphObject.Horizontal,
            font: "12pt Segoe UI,sans-serif",
            editable: true,
            isMultiline: false,
            minSize: new go.Size(10, 16),
          },
          new go.Binding("text", "name").makeTwoWay()
        ),

        $(
          go.TextBlock,
          textStyle(),
          {
            row: 1,
            column: 0,

            editable: true,
            isMultiline: false,
          },
          new go.Binding("text", "key", function (v) {
            return "ID: " + v;
          })
        ),
        $(
          go.TextBlock,
          textStyle(),
          { name: "boss", row: 2, column: 0 }, // we include a name so we can access this TextBlock when deleting Nodes/Links
          new go.Binding("text", "parent", function (v) {
            return "Boss " + v;
          })
        )
      )
    )
  );

  return myDiagram;
}
function save() {
  const newNodeDataArra = myDiagram.model.toJson();
  myDiagram.isModified = false;
  console.log(newNodeDataArra);
}
function handleModelChange(changes) {
  console.log(nodeDataArra);
}

const Diagrama = () => {
  const { users } = useContext(RedmineContext);

  nodeDataArra = users.map((user, index) => {
    let parentId;
    if (index === 0) {
      parentId = "";
    } else if (index === 1 || index === 2 || index === 7) {
      parentId = 0;
    } else if (index === 3 || index === 4) {
      parentId = 1;
    } else if (index === 5 || index === 6) {
      parentId = 8;
    } else if (index === 8 || index === 9) {
      parentId = 7;
    }
    return {
      key: index,
      name: `${user.firstname} ${user.lastname}`,
      color: "orange",
      source: ingURL,
      parent: parentId,
      id: user.id,
    };
  });

  return (
    <React.Fragment>
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName={classes["diagram-component"]}
        nodeDataArray={nodeDataArra}
        onModelChange={handleModelChange}
      />
      <p>
        <button id="zoomToFit">Zoom to Fit</button>
        <button id="centerRoot">Center on root</button>
      </p>
      <div>
        <button className="btn btn-primary mt-2" id="SaveButton" onClick={save}>
          Save
        </button>
      </div>

      {/* <button className="btn btn-danger mt-2" onClick="load()">
        Load
      </button> */}
    </React.Fragment>
  );
};

export default Diagrama;
