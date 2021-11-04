# Graph Configuration
This tutorial explores the movie _The Lion King_ and visualizes the different relationships between the characters.
The [Movie Characters](./src/MovieCharacter.c3typ) are created through [seed data](./seed/MovieCharacter/characters.csv).  All of the characters [interactions](./src/MovieCharacterInteraction.c3typ) were tracked each time they appeared on the screen together in a new setting and also created through [seed data](./seed/MovieCharacterInteraction/interactions.csv).  To deduplicate the interactions each unique pair of interactions creates a single [relation](./src/MovieCharacterRelation.c3typ).

# Graph Interaction
The Filter Panel will allow the User to select which Movie Character is in the center of the graph or leave blank to view the entire graph network.  Clicking a node will show the character's image and name

## Ui Setup

The main page [DataVisionTutorial.DataVisionTutorialPage](./ui/c3/meta/DatVisionTutorial/DataVisionTutorial.DataVisionTutorialPage.json) is composed of a UiSdlNavMenu, 2 UiSdlSidePanels, and a UiSdlDataVisionGraph.
The left hand panel (UiSdlSidePanelContainer) has a UiSdlFilterPanel and the child which is another UiSdlSidePanelContainer which then has the Graph / Node / Edge side panel and the child is the actual graph

## FAQS

* My graph does not return the right data for the nodes / edges
  * If you are using the DataVisionGraph and it has already been cached then you will have to uncache it.  Simply call MyGraphType.resetGraph.
  * Check the `includeSpec` of your vertices and edges.  See DataVisionGraph.getVertexSpec and DataVisionGraph.getEdgeSpec
* I want to change the rendering logic
  * All the components JSX files are in this folder `dataVisionBase/ui/sdl-react/src/reactComponents`
  * The [graph](../dataVisionBase/ui/sdl-react/src/reactComponents/SDLDataVisionGraph.jsx)
*
