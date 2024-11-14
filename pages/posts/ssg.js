export async function getStaticProps() {
    // Mengambil data dari API
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const post = await res.json();

    // Mengirim data ke komponen sebagai props
    return {
        props: { post },
        revalidate: 10, // (opsional) waktu refresh data (dalam detik)
    };
}

export default function SSGPage({ post }) {
    return (
        <div>
            <h1>Static Site Generated Post</h1>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
        </div>
    );
}
