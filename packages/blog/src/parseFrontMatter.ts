const matter = require("gray-matter");

// TODO: Allow excerpt length to be configurable
const EXCERPT_LENGTH = 280;

function parseFrontMatter(file) {
  const { content, data, excerpt } = matter(file, { excerpt: true });

  // TODO: validate date for frontmatter and give a nice error message

  if (typeof data.tags === "string") {
    data.tags = data.tags.split(",").map((tag) => tag.trim());
  }

  if (typeof data.author === "string") {
    data.author = data.author.split(",").map((author) => author.trim());
  }

  if (excerpt) {
    data.excerpt = excerpt.replace(/\n/g, "");
  } else {
    let cleanContent = content
      .replace(/!\[.+\]\[.+\]/g, "") // Remove Image Tags
      .replace(/[>[*_\]\n](\(.+\))*/g, ""); // Remove misc syntax (inc. Link Hrefs but not link text)
    let firstHeadline = cleanContent.indexOf("#");

    if (firstHeadline === -1 || firstHeadline > EXCERPT_LENGTH) {
      data.excerpt = cleanContent.substr(0, EXCERPT_LENGTH);
    } else if (firstHeadline === 0) {
      data.excerpt = cleanContent.substr(0, EXCERPT_LENGTH).replace(/#/g, "");
    } else {
      data.excerpt = cleanContent.substr(0, firstHeadline);
    }

    data.excerpt += "...";
  }

  return {
    data,
    content,
  };
}

// module.exports = parseFrontMatter;
export default parseFrontMatter;
