const AdminPage = async ({ params }: { params: { slug: string } }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">Overview</h2>
      <p className="text-sm text-muted-foreground">
        Select a board from the sidebar to manage feedback.
      </p>
    </div>
  );
};

export default AdminPage;
