const remark = require("remark");
const stringify = require("remark-stringify");
const { promisify } = require("util");
const visit = require("unist-util-visit");
const { kebabCase } = require("lodash");

async function transformMarkdown({ lang, part, letter }, id, node) {
  const content = new Map();

  const transform = (options) => (tree) => {
    let current = null;

    visit(tree, (node) => {
      if (
        node.type === "heading" &&
        node.depth > 2 &&
        node.children &&
        node.children[0].type === "text" &&
        lang !== "es"
      ) {
        // current = `${node.children[0].value}\n${lang}\n${part}\n${letter}\n${id}`;
        // id: `${_heading} ___${node.frontmatter.lang}_${ node.frontmatter.letter }_${node.frontmatter.part}_${index}_${node.id}`,
        current = `${node.children[0].value} ___${lang}_${letter}_${part}_${id}`;
        //  __${lang}__${part}__${letter}__${id}`;
      } else if (node.type === "paragraph" && current) {
        if (!content.has(current)) {
          content.set(current, "");
        } else {
          let paragraph = content.get(current);
          const { children } = node;

          children.forEach((e) =>
            e.type === "link"
              ? (paragraph += e.children[0].value)
              : (paragraph += e.value)
          );

          content.set(current, paragraph);
        }
      }
    });

    // for (let [k, v] of content.entries()) {
    content.delete();
    for (let __map of content.entries()) {
      let [k, v] = __map;
      if (!v) content.delete(k);
    }
  };

  await remark().use(transform).use(stringify).process(node);

  return Array.from(content).map(([name, value]) => ({
    // id: kebabCase(name) + `  __${lang}_${part}_${letter}_${id}`,

    id: name,
    part,
    letter,
    lang,
    heading: value,
  }));

  // return content;
  // return Promise.resolve(content)
  //   .then(myMap => {
  //     if (myMap.size > 0) {
  //       return Array.from(myMap).map(([name, value]) => ({id, part, letter, lang, name, value}))
  //     }
  //     else
  //       null;

  //   })
}
module.exports = { transformMarkdown };
