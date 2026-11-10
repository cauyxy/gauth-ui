# ReplyActions

The row under a reply from Gauth AI: the two votes, copy, then the product's own actions. `ReplyActions` in `src/learning/ReplyActions.tsx`.

- Every action is an `IconButton`, `ghost` and `sm`. The product adds its own as children (quote, try again), in the same look.
- The row starts flush with the reply: the first icon's strokes are on the text's edge.
- A thumb is a toggle. The page keeps `vote`; the pressed thumb has the soft ground and an ink icon, and pressing it again clears it. Leave out `onVote` and the row has no thumbs.
- Copy shows a check and is named "Copied" for two seconds. The page writes to the clipboard in `onCopy`. No toast: the check is the answer.
