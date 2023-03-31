import { usePostContext } from 'src/context/post-context';
import Loading from 'src/components/Loading';
import IdeaCard from 'src/sections/feed/main/card-components/Card';

export default function PostList({ userId }) {
    const { listPost, loading } = usePostContext();

    if (loading) {
        return <Loading />;
    }

    if (listPost.length < 1) {
        return <p>No posts found.</p>;
    }

    return (
        <div>
            {listPost?.map((post) => {
                return <IdeaCard post={post} key={post.id} userId={userId} />;
            })}
        </div>
    );
}
