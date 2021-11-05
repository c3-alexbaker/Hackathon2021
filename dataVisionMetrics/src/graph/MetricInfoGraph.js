/*
 * Copyright 2009-2021 C3 AI (www.c3.ai). All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

function getGraph(cacheKey, centerVertex) {
  var graph = MovieCharacterGraph.make({ m_cacheKey: cacheKey });
  var edges;
  var vertices;
  if (!centerVertex.id) {
    edges = graph.edges() || [];
    vertices = graph.vertices() || [];
  } else {
    edges = graph.connectedEdges(centerVertex);
    var vertexIds = edges
      .map(function(edge) {
        return edge.at("from.id") === centerVertex.id ? edge.at("to.id") : edge.at("from.id");
      })
      .concat([centerVertex.id]);
    var vertexFilter = Filter.intersects("id", vertexIds);
    vertices = graph.vertices(vertexFilter) || [];
  }

  return transformGraph(vertices, edges);
}

function getVertexSpec() {
  var vertexInclude = ["name", "id", "imageUrl"];
  return {
    include: vertexInclude.join(", "),
    filter: "1 == 1"
  };
}

function getEdgeSpec() {
  var edgeInclude = ["from.id", "from.name", "id", "to.id", "to.name", "numberOfInteractions"];

  return {
    include: edgeInclude.join(", "),
    filter: "1 == 1"
  };
}

/**
 * Helper function to make sure all APIs that return nodes and edges are consistently returning the expected values
 * @param {Object[]} vertices - The vertices to transform
 * @param {Object[]} edges - The edges to transform
 * @returns {Graph} The graph with the nodes and edges transformed
 */
function transformGraph(vertices, edges) {
  edges = edges.map(function(edge) {
    // Make sure any configurations that should be in the visual parts of the graph are returned here
    return MovieCharacterRelation.make({
      id: edge.id,
      from: { id: edge.at("from.id"), name: edge.at("from.name") },
      to: { id: edge.at("to.id"), name: edge.at("to.name") },
      numberOfInteractions: edge.numberOfInteractions
    });
  });
  vertices = vertices.map(function(vertex) {
    // Make sure any configurations that should be in the visual parts of the graph are returned here
    return MovieCharacter.make({
      name: vertex.name,
      id: vertex.id,
      imageUrl: vertex.imageUrl
    });
  });

  return {
    m_vertices: vertices,
    m_edges: edges
  };
}
