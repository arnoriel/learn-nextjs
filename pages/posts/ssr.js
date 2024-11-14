export async function getServerSideProps() {
    // Mengambil data dari API
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const post = await res.json();

    // Mengirim data ke komponen sebagai props
    return {
        props: { post },
    };
}

export default function SSRPage({ post }) {
    return (
        <div>
            <h1>Server-Side Rendered Post</h1>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
        </div>
    );
}
