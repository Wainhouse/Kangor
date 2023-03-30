exports.voteCounter = (voteObj) => {
  const voteObjCopy = {...voteObj}
  return +voteObjCopy.inc_votes
}

