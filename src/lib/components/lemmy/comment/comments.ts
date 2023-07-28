import type { Comment, CommentView } from 'lemmy-js-client'

export interface CommentNodeI {
  comment_view: CommentView
  children: Array<CommentNodeI>
  depth: number
  loading?: boolean
}

function getCommentParentId(comment?: Comment): number | undefined {
  const split = comment?.path.split('.')
  // remove the 0
  split?.shift()

  return split && split.length > 1
    ? Number(split.at(split.length - 2))
    : undefined
}

function getDepthFromComment(comment?: Comment): number | undefined {
  const len = comment?.path.split('.').length
  return len ? len - 2 : undefined
}

export function buildCommentsTree(
  comments: CommentView[],
  parentComment: boolean,
  baseDepth: number = 0
): CommentNodeI[] {
  const map = new Map<number, CommentNodeI>()
  const depthOffset = !parentComment
    ? 0
    : getDepthFromComment(comments[0].comment) ?? 0

  for (const comment_view of comments) {
    const depthI = getDepthFromComment(comment_view.comment) ?? 0
    const depth = depthI ? depthI - depthOffset : 0
    const node: CommentNodeI = {
      comment_view,
      children: [],
      depth: depth + baseDepth,
    }
    map.set(comment_view.comment.id, { ...node })
  }

  const tree: CommentNodeI[] = []

  // if its a parent comment fetch, then push the first comment to the top node.
  if (parentComment) {
    const cNode = map.get(comments[0].comment.id)
    if (cNode) {
      tree.push(cNode)
    }
  }

  for (const comment_view of comments) {
    const child = map.get(comment_view.comment.id)
    if (child) {
      const parent_id = getCommentParentId(comment_view.comment)
      if (parent_id) {
        const parent = map.get(parent_id)
        // Necessary because blocked comment might not exist
        if (parent) {
          parent.children.push(child)
        }
      } else {
        if (!parentComment) {
          tree.push(child)
        }
      }
    }
  }

  return tree
}

export function searchCommentTree(
  tree: CommentNodeI[],
  id: number
): CommentNodeI | undefined {
  for (const node of tree) {
    if (node.comment_view.comment.id === id) {
      return node
    }

    for (const child of node.children) {
      const res = searchCommentTree([child], id)

      if (res) {
        return res
      }
    }
  }
  return undefined
}

export function insertCommentIntoTree(
  tree: CommentNodeI[],
  cv: CommentView,
  parentComment: boolean
) {
  // Building a fake node to be used for later
  const node: CommentNodeI = {
    comment_view: cv,
    children: [],
    depth: 0,
  }

  const parentId = getCommentParentId(cv.comment)
  if (parentId) {
    const parent_comment = searchCommentTree(tree, parentId)
    if (parent_comment) {
      node.depth = parent_comment.depth + 1
      parent_comment.children.unshift(node)
    }
  } else if (!parentComment) {
    tree.unshift(node)
  }
}

export async function buildCommentsTreeAsync(
  comments: CommentView[],
  parentComment: boolean
) {
  const result = buildCommentsTree(comments, parentComment)

  return result
}
