import React from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import classes from "./Diagrama.module.scss";
import { useContext } from "react";
import { RedmineContext } from "../context/redmine/redmineContext";

const ingURL =
  "https://lh3.googleusercontent.com/proxy/FO0H1tQvc1NH-aWJj5MWVDqyLjqvopcbLVyte2rVhpCG5jZHgQagFyn2DTwdnkI5voI0Aox7BZwrY5qcpaCM4G3JIu37q7-ZZRLQOI8ieHp74VM-t6ai_HVQTb8";

const nodeDataArra = [
  {
    key: 0,
    text: "Алексей Безпаленко",
    color: "orange",
    // loc: "0 0",
    source: ingURL,
  },
  {
    key: 1,
    text: "Александр Чиняков",
    color: "orange",
    // loc: "150 0",
    source: ingURL,
    parent: 0,
  },
  {
    key: 2,
    text: "Alexander Perel",
    color: "lightgreen",
    // loc: "0 150",
    source: ingURL,
    parent: 0,
  },
  {
    key: 3,
    text: "Анастасия Беседина",
    color: "pink",
    // loc: "150 150",
    source: ingURL,
    parent: 1,
  },
  {
    key: 3,
    text: "Алла Мец",
    color: "pink",
    // loc: "150 150",
    source: ingURL,
    parent: 1,
  },
  {
    key: 3,
    text: "Александр присяжный",
    color: "pink",
    // loc: "150 150",
    source: ingURL,
    parent: 2,
  },
  {
    key: 3,
    text: "Алексей Битюков",
    color: "pink",
    // loc: "150 150",
    source: ingURL,
    parent: 2,
  },
  {
    key: 3,
    text: "Алексей Гладковский",
    color: "pink",
    // loc: "150 150",
    source: ingURL,
    parent: 3,
  },
  {
    key: 3,
    text: "Алина Петровская",
    color: "pink",
    // loc: "150 150",
    source: ingURL,
    parent: 3,
  },
];

function initDiagram() {
  const $ = go.GraphObject.make;
  // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
  const myDiagram = $(go.Diagram, {
    maxSelectionCount: 100, //количество одновременно выбранных элементов
    validCycle: go.Diagram.CycleDestinationTree, // в узел может входить любое количество исходных ссылок, но не более одной целевой ссылки может выходить из узла

    // "clickCreatingTool.archetypeNodeData": {

    // },
    "undoManager.isEnabled": true, // must be set to allow for model change listening
    // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
    // двойным щелчком создать новый узел
    "clickCreatingTool.archetypeNodeData": {
      // двойным щелчком создать новый узел
      text: "new node",
      color: "lightblue",
      //   name: "(new person)",
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

    // model: $(go.GraphLinksModel, {
    //   linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel ??
    // }),
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
  //   var levelColors = [
  //     "#AC193D",
  //     "#2672EC",
  //     "#8C0095",
  //     "#5133AB",
  //     "#008299",
  //     "#D24726",
  //     "#008A00",
  //     "#094AB2",
  //   ];

  // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
  //   myDiagram.layout.commitNodes = function () {
  //     go.TreeLayout.prototype.commitNodes.call(myDiagram.layout); // do the standard behavior
  //     // then go through all of the vertexes and set their corresponding node's Shape.fill
  //     // to a brush dependent on the TreeVertex.level value
  //     myDiagram.layout.network.vertexes.each(function (v) {
  //       if (v.node) {
  //         var level = v.level % levelColors.length;
  //         var color = levelColors[level];
  //         var shape = v.node.findObject("SHAPE");
  //         if (shape)
  //           shape.stroke = $(go.Brush, "Linear", {
  //             0: color,
  //             1: go.Brush.lightenBy(color, 0.05),
  //             start: go.Spot.Left,
  //             end: go.Spot.Right,
  //           });
  //       }
  //     });
  //   };

  //   function textStyle() {
  //     return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
  //   }
  //   function nodeDoubleClick(e, obj) {
  //     var clicked = obj.part;
  //     if (clicked !== null) {
  //       //   var thisemp = clicked.data;
  //       myDiagram.startTransaction("add employee");
  //       var newemp = {
  //         text: "new node",
  //         color: "lightblue",
  //         // name: "(new person)",
  //         // title: "",
  //         // comments: "",
  //         // parent: thisemp.key,
  //       };
  //       myDiagram.model.addNodeData(newemp);
  //       myDiagram.commitTransaction("add employee");
  //     }
  //   }

  // define a simple Node template
  myDiagram.nodeTemplate = $(
    go.Node,
    "Auto",
    // new go.Binding("text", "text"),
    // { doubleClick: nodeDoubleClick }, // the Shape will go around the TextBlock
    // new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
    //   go.Point.stringify
    // ),
    $(
      go.Shape,
      "Rectangle",
      {
        name: "SHAPE",
        fill: "white",
        stroke: "purple",
        strokeWidth: 3.5,
        portId: "",
        fromLinkable: true,
        toLinkable: true,
        cursor: "pointer",
      },
      // Shape.fill is bound to Node.data.color
      new go.Binding("fill", "color")
    ),

    $(
      go.Panel,
      "Horizontal",
      $(
        go.Picture,
        { margin: 10, width: 50, height: 50, background: "red" },
        new go.Binding("source")
      ),

      $(
        go.Panel,
        "Table",
        {
          minSize: new go.Size(150, NaN),
          // maxSize: new go.Size(150, NaN),
          margin: new go.Margin(6, 10, 0, 6),
          defaultAlignment: go.Spot.Left,
        },
        $(go.RowColumnDefinition, { column: 2, width: 4 }),
        $(
          go.TextBlock,
          "stretch: Horizontal",
          // textStyle(), // the name
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
          new go.Binding("text", "text").makeTwoWay()
        ),
        // $(go.TextBlock, "id: ", { row: 1, column: 0 }),
        $(
          go.TextBlock,
          {
            row: 1,
            column: 0,
            // columnSpan: 4,
            editable: true,
            isMultiline: false,
            // minSize: new go.Size(10, 14),
            // margin: new go.Margin(0, 0, 0, 3),
          },
          new go.Binding("text", "key", function (v) {
            return "ID: " + v;
          })
        ),
        $(
          go.TextBlock,
          // textStyle(),
          { name: "boss", row: 2, column: 0 }, // we include a name so we can access this TextBlock when deleting Nodes/Links
          new go.Binding("text", "parent", function (v) {
            return "Boss: " + v;
          })
        )
      )

      // $(
      //   go.TextBlock,
      //   "Default Text",
      //   { margin: 12, stroke: "white", font: "bold 16px sans-serif" },
      //   new go.Binding("text", "text")
      // )
    )

    // $(
    //   go.TextBlock,
    //   { margin: 8, editable: true }, // some room around the text
    //   new go.Binding("text").makeTwoWay()
    // )
  );

  return myDiagram;
}

function handleModelChange(changes) {
  console.log("GoJS model changed!");
}

const Diagrama = () => {
  const { users } = useContext(RedmineContext);

  console.log(users);
  return (
    <ReactDiagram
      initDiagram={initDiagram}
      divClassName={classes["diagram-component"]}
      nodeDataArray={nodeDataArra}
      // linkDataArray={[
      //   { key: -1, from: 0, to: 1 },
      //   { key: -2, from: 0, to: 2 },
      //   { key: -3, from: 0, to: 3 },
      //   { key: -4, from: 0, to: 4 },
      // ]}
      onModelChange={handleModelChange}
    />
  );
};

export default Diagrama;
