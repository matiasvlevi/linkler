async function loadLinks() {
    const response = await fetch('./links');
    const data = await response.json();

    console.log(data);
}
