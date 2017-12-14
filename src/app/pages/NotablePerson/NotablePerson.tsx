import * as React from 'react';
import gql from 'graphql-tag';
import { client } from 'api/client';
import { NotablePersonQuery } from 'api/types';
import { Post } from 'components/Post/Post';
import { PersonDetails } from 'components/PersonDetails/PersonDetails';
import { FbComments } from 'components/FbComments/FbComments';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';
import { withRouter } from 'react-router-dom';
import { resolve } from 'react-resolver';
import { Result, isErrorResult } from 'helpers/results';
import { Card } from 'components/Card/Card';

import { prettifyUrl } from 'helpers/prettifyUrl';

import warningIconUrl from 'icons/warning.svg';

import * as classes from './NotablePerson.module.scss';

const warningIcon = <SvgIcon url={warningIconUrl} size={100} />;

const reload = () => {
  location.reload();
};

const query = gql`
  fragment commonEventProps on NotablePersonEvent {
    id
    type
    quote
    isQuoteByNotablePerson
    labels {
      id
      text
    }
    sourceUrl
    postedAt
    happenedOn
  }

  query NotablePerson($slug: String!) {
    notablePerson(slug: $slug) {
      name
      photoUrl
      summary
      commentsUrl
      labels {
        id
        text
      }
      quotes: events(query: { type: quote }) {
        ...commonEventProps
      }
      editorialSummary {
        author
        lastUpdatedOn
        nodes {
          text
          type
          sourceUrl
          sourceTitle
        }
      }
    }
  }
`;

type OwnProps = {};
type ResolvedProps = {
  queryResult: Result<NotablePersonQuery>;
};

class Page extends React.PureComponent<OwnProps & ResolvedProps> {
  // tslint:disable-next-line:max-func-body-length
  render() {
    const { queryResult } = this.props;
    if (isErrorResult(queryResult)) {
      return (
        <MessageWithIcon
          caption="Are you connected to the internet?"
          description="Please check your connection and try again"
          actionText="Retry"
          icon={warningIcon}
          onActionClick={reload}
        />
      );
    }

    const { data } = queryResult;
    if (!data.notablePerson) {
      return (
        <MessageWithIcon
          caption="Not Found"
          description="We do not have a page for this notable person"
          icon={warningIcon}
        />
      );
    } else {
      const { notablePerson } = data;
      const {
        name,
        photoUrl,
        quotes,
        labels,
        summary,
        commentsUrl,
      } = notablePerson;

      return (
        <div>
          <PersonDetails
            name={name}
            labels={labels}
            photoUrl={photoUrl}
            summary={summary}
          />
          {quotes.length > 0 ? (
            <ul className={classes.list}>
              <h2>Quotes</h2>
              {quotes.map(quote => (
                <li key={quote.id}>
                  <Card className={classes.card}>
                    <Post
                      title={<h3>{notablePerson.name}</h3>}
                      photoUrl={notablePerson.photoUrl}
                      postedAt={new Date(quote.postedAt)}
                      happenedOn={
                        quote.happenedOn ? new Date(quote.happenedOn) : null
                      }
                      sourceName={prettifyUrl(quote.sourceUrl)}
                      sourceUrl={quote.sourceUrl}
                      labels={quote.labels}
                    >
                      {quote.quote}
                    </Post>
                  </Card>
                </li>
              ))}
            </ul>
          ) : null}
          <OptionalIntersectionObserver rootMargin="0% 0% 25% 0%" triggerOnce>
            {inView => {
              if (inView) {
                return (
                  <FbComments className={classes.comments} url={commentsUrl} />
                );
              } else {
                return null;
              }
            }}
          </OptionalIntersectionObserver>
        </div>
      );
    }
  }
}

const ResolvedPage = resolve('queryResult', async ({ slug }) => {
  try {
    const data = await client.request<NotablePersonQuery>(query, { slug });

    return {
      data,
    };
  } catch (error) {
    return {
      error,
    };
  }
})(Page);

export const NotablePerson = withRouter(({ match: { params: { slug } } }) => (
  <ResolvedPage slug={slug} />
));
