import React from 'react';
import { Link } from 'gatsby';
import snakeCase from 'lodash/fp/snakeCase';
import { useTranslation } from 'react-i18next';

import navigation from '../../content/partnavigation/partnavigation';
import Element from '../Element/Element';
import { SubHeader } from '../SubHeader/SubHeader';

import Highlighter from 'react-highlight-words';

const SearchResults = ({ query, results = [] }) => {
  const FullResults = ({ heading }) => {
    if (heading) {
      // const _html = results[0].heading;
      // const position = _html.indexOf(query);

      return (
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[query]}
          autoEscape={true}
          textToHighlight={heading.slice(0, 500)}
          // dangerouslySetInnerHTML={{
          //   // __html: _html.slice(0, 500),
          //   __html: heading.slice(0, 500),
          // }}
        />
      );
    }
  };

  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (results.length === 0) {
    return (
      <Element>
        <SubHeader text={t('searchPage:noMatches')} headingLevel="h2" />
      </Element>
    );
  }

  if (results.length > 0) {
    return (
      <Element>
        <SubHeader
          text={t('searchPage:matchesTitle', { count: results.length, query })}
          headingLevel="h2"
        />

        <ol>
          {results.map(({ id, part, letter, heading }) => (
            <li key={`${id}`}>
              <Link
                to={`/${
                  lang === 'en' ? 'en/part' : lang === 'zh' ? 'zh/part' : 'osa'
                }${part}/${snakeCase(navigation[lang][part][letter])}${
                  id[0] === ' ' ? '' : '#' + id.split(' ')[0]
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div>
                  {`part ${part}, ${letter}: ${navigation[lang][part][letter]}${
                    id[0] === ' ' ? '' : '#' + id.split(' ')[0]
                  }`}
                </div>
              </Link>
              <br />
              {heading && <FullResults heading={heading} />}
            </li>
          ))}
        </ol>
      </Element>
    );
  }
};

export default SearchResults;
