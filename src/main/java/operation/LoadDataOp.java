package operation;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@Path("/load/microblog")
public class LoadDataOp {
	private static String driverName = "org.apache.hadoop.hive.jdbc.HiveDriver";

	@POST
	@Produces("text/json")
	public String loadData(String location) {
		try {
			Class.forName(driverName);
			Connection con;
			con = DriverManager.getConnection("jdbc:hive2://localhost:10000/default", "", "");
			Statement stmt = con.createStatement();
			ResultSet res = stmt.executeQuery(
					String.format("create external table newrawdata(rec string) location \"%s\";", location));
			// TODO 判断是否创建成功
			res = stmt.executeQuery(
					"create table microblog_incre if not exists as select extractblog(rec) from newrawdata;");
			res = stmt.executeQuery("insert overwrite into mciroblog_base partition(rdate)" + " select distinct * from ("
					+ "	select /*mapjoin(modify_date)*/ *, datetoweek(created_at) (" + " from microblog_base ("
					+ " join (select distinct created_at from microblog_incre)(" + " modify_date ("
					+ " on (microblog_base.created_at = modify_date.created_at)(" + "	union("
					+ "	select *, datetoweek(created_at) from mciroblog_incre);");
			res = stmt.executeQuery("truncate microblog_incre;");
			res = stmt.executeQuery("drop external table newrawdata");

		} catch (SQLException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}

	}

}
