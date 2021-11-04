/*
 * Copyright 2009-2021 C3 AI (www.c3.ai). All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

var logger = C3.logger("MovieCharacterInteraction");

function afterCreate(objs) {
  logger.info("afterCreate called with " + objs.length + " entities.");

  /**
   * Create a map<string, MovieCharacterRelation>.  The keys will be `from.id-to.id`, this will allow to make sure
   * duplicates are not created during this process.
   */
  var relationsMap = {};
  objs.forEach(function(interaction) {
    var relation;
    var from = interaction.from;
    var to = interaction.to;
    var relationKey = from.id + "-" + to.id;
    var relationExistsInDatabase = relationExists(from, to);
    var currentBatchRelation = relationsMap[relationKey];
    /**
     * If there is no relation in the dataBase nor in the current batch being processed create a new one
     */
    if (!relationExistsInDatabase && !currentBatchRelation) {
      relation = MovieCharacterRelation.make({
        from: from,
        to: to,
        numberOfInteractions: 1
      });
      relationsMap[relationKey] = relation;
    } else if (currentBatchRelation) {
      /**
       * If we have already created a relation during this batch increment the number of interactions by 1
       */
      currentBatchRelation.numberOfInteractions++;
    } else if (relationExistsInDatabase) {
      relation = getExistingRelation(from, to);
      relation = relation.putField("numberOfInteractions", relation.numberOfInteractions + 1);
      /**
       * Leverage the relationsMap object to track the relation incase we see it again.  The else if block before this will
       * make sure we don't query the data base again and get "stale" data
       */
      relationsMap[relationKey] = relation.toJson();
    }
  });
  MovieCharacterRelation.mergeBatch(_.values(relationsMap));
}

/**
 * Check if there is an existing relation between the two characters
 * @param {MovieCharacter} from
 * @param {MovieCharacter} to
 * @returns {Boolean} Whether or not there is a relationship for this from-to pair
 */
function relationExists(from, to) {
  return MovieCharacterRelation.exists({
    filter: Filter.eq("from.id", from.id)
      .and()
      .eq("to.id", to.id)
  });
}

/**
 * Get the existing relation between two characters
 * @param {MovieCharacter} from
 * @param {MovieCharacter} to
 * @returns {MovieCharacterRelation} The relation between the from and to
 */
function getExistingRelation(from, to) {
  return MovieCharacterRelation.fetch({
    limit: 1,
    filter: Filter.eq("from.id", from.id)
      .and()
      .eq("to.id", to.id),
    include: "id, numberOfInteractions"
  }).first();
}
