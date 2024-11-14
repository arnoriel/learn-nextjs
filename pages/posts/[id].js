import { useRouter } from 'next/router';

export default function Post() {
    const router = useRouter();
    const { id } = router.query;

    return <h1>Post ID: {id}</h1>;
}
