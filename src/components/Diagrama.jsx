import React from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import classes from "./Diagrama.module.scss";

const nodeDataArra = [
  { key: 0, text: "Алексей Безпаленко", color: "red", loc: "0 0" },
  { key: 1, text: "Александр Чиняков", color: "orange", loc: "150 0" },
  { key: 2, text: "Alexander Perel", color: "lightgreen", loc: "0 150" },
  { key: 3, text: "Флександр присяжный", color: "pink", loc: "150 150" },
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

    model: $(go.GraphLinksModel, {
      linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel ??
    }),
  });

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
    // { doubleClick: nodeDoubleClick }, // the Shape will go around the TextBlock
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
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
      go.TextBlock,
      { margin: 8, editable: true }, // some room around the text
      new go.Binding("text").makeTwoWay()
    )
  );

  return myDiagram;
}

function handleModelChange(changes) {
  console.log("GoJS model changed!");
}

const Diagrama = () => {
  return (
    <ReactDiagram
      initDiagram={initDiagram}
      divClassName={classes["diagram-component"]}
      nodeDataArray={nodeDataArra}
      linkDataArray={[
        { key: -1, from: 0, to: 1 },
        { key: -2, from: 0, to: 2 },
        { key: -3, from: 0, to: 3 },
        { key: -4, from: 0, to: 4 },
      ]}
      onModelChange={handleModelChange}
    />
  );
};

export default Diagrama;
