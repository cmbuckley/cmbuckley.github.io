---
title: MySQL Joys
layout: post
categories:
  - Computing
---
[<acronym title="First normal form">1NF</acronym>](http://en.wikipedia.org/wiki/First_normal_form){.nodec} teaches us that we should not store repeating groups in fields. Given that we have a table satisfying 1NF containing values as such:

<table>
  <tr>
    <th>
      <code>person_id</code>
    </th>
    
    <th>
      <code>transaction_id</code>
    </th>
  </tr>
  
  <tr>
    <td>
      1
    </td>
    
    <td>
      1
    </td>
  </tr>
  
  <tr>
    <td>
      2
    </td>
    
    <td>
      1
    </td>
  </tr>
  
  <tr>
    <td>
      1
    </td>
    
    <td>
      2
    </td>
  </tr>
  
  <tr>
    <td>
      1
    </td>
    
    <td>
      3
    </td>
  </tr>
</table>

It is simple to select all people involved in a transaction, or all transactions attributed to one person. But how would we find out, say, those people who had been involved in both transaction 1 and transaction 2? It wasn’t clear to me, until now:

<pre>SELECT `person_id`
  FROM (
    SELECT `person_id`
      FROM `table`
      WHERE `transaction_id` IN (1, 2)
  )
  AS `people`
  GROUP BY `person_id`
  HAVING COUNT(`person_id`) = 2</pre>

The first `SELECT` returns all those people that have been in _either_ of the two transactions. The second groups the people, and selects those that appear twice — in other words, those that were in both transactions. It looks so simple in hindsight!

This has interesting extensions — one could select people that have appeared in any number of an arbitrary list of transactions.

It is possible to avoid a second `SELECT` by using `GROUP_CONCAT()`, but that loses some of the functionality — as well as the elegance.