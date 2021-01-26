const remark = require('remark');
const stringify = require('remark-stringify');

const { promisify } = require('util');

const visit = require('unist-util-visit');
const { kebabCase } = require('lodash');

async function transformMarkdown({ node, id, lang, part, letter }) {
  const content = new Map();

  const transform = options => tree => {
    let current = null;

    visit(tree, node => {
      if (
        node.type === 'heading' &&
        node.depth > 2 &&
        node.children &&
        node.children[0].type === 'text'
      ) {
        // current = `${kebabCase( node.children[0].value)} ${lang} ${part} ${letter} ${id}`;
        current = `${node.children[0].value}\n${lang}\n${part}\n${letter}\n${id}`;
      } else if (node.type === 'paragraph' && current) {
        if (!content.has(current)) {
          content.set(current, '');
        } else {
          // let value = content.get(current);
          let paragraph = content.get(current);
          const { children } = node;

          // let paragraph = "";
          children.forEach(e =>
            e.type === 'link'
              ? // ? content.set(value.push(e.children[0].value))
                // : content.set(value.push(e.value))
                (paragraph += e.children[0].value)
              : (paragraph += e.value)
          );

          content.set(current, paragraph);

          // if (value.length > 1) content.set(current, [value.join("\n")]);

          /*
           *   [ 'In ',
           *     'part 5',
           *     ' we got familiar with one of these libraries, the ', ...]
           *
           *
           */
        }
      }
    });

    // console.log(content.get("testing-components"));
    for (let [k, v] of content.entries()) {
      if (!v) content.delete(k);
    }
  };

  await remark()
    .use(transform)
    .use(stringify)
    .process(node);

  return Promise.resolve(content);
}

module.exports = { transformMarkdown };
